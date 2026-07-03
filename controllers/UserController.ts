// controllers/UserController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";

// ✅ Importer les enums depuis Prisma
import { UserStatus, UserRole } from "@prisma/client";

export class UserController {
  // ============================================
  // LISTE DES UTILISATEURS
  // ============================================
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
      const search = searchParams.get("search") || "";
      const role = searchParams.get("role") || "all";
      const status = searchParams.get("status") || "all";

      const companyId = user.companyId;

      // ✅ Construire le where avec des conditions validées
      const where: any = { companyId };

      // ✅ Filtrer par recherche
      if (search && search.trim() !== "") {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      // ✅ Filtrer par rôle (en utilisant l'enum UserRole)
      if (role && role !== "all") {
        const validRoles = ["admin", "manager", "cashier", "employee", "super_admin"];
        if (validRoles.includes(role)) {
          where.role = role as UserRole;
        }
      }

      // ✅ Filtrer par statut (en utilisant l'enum UserStatus)
      if (status && status !== "all") {
        const validStatuses = ["active", "inactive", "pending", "suspended"];
        if (validStatuses.includes(status)) {
          where.status = status as UserStatus;
        }
      }

      console.log("🔍 Where clause:", JSON.stringify(where, null, 2));

      // ✅ Exécuter les requêtes
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            status: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.user.count({ where }),
      ]);

      console.log(`✅ ${users.length} utilisateurs trouvés sur ${total}`);

      // ✅ Statistiques avec les enums Prisma
      const [totalCount, activeCount, pendingCount, inactiveCount] = await Promise.all([
        prisma.user.count({ where: { companyId } }),
        prisma.user.count({ where: { companyId, status: UserStatus.active } }),
        prisma.user.count({ where: { companyId, status: UserStatus.pending } }),
        prisma.user.count({ where: { companyId, status: UserStatus.inactive } }),
      ]);

      return successResponse({
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          total: totalCount,
          active: activeCount,
          pending: pendingCount,
          inactive: inactiveCount,
        },
      });
    } catch (error: any) {
      console.error("❌ User index error:", error);
      return errorResponse(
        error.message || "Erreur lors de la récupération des utilisateurs",
        500
      );
    }
  }

  // ============================================
  // CRÉER UN UTILISATEUR
  // ============================================
  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      const { email, firstName, lastName, phone, role } = body;

      // ✅ Validation des champs requis
      if (!email || !firstName || !lastName) {
        return errorResponse("Email, prénom et nom sont requis", 400);
      }

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return errorResponse("Cet email est déjà utilisé", 400);
      }

      // Générer un mot de passe temporaire
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(tempPassword);

      // ✅ Utiliser les enums pour le rôle et le statut
      const userRole = role && role in UserRole ? role as UserRole : UserRole.employee;

      const newUser = await prisma.user.create({
        data: {
          companyId: user.companyId,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          role: userRole,
          status: UserStatus.pending,
          emailVerified: false,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      // 🔄 TODO: Envoyer l'email d'invitation
      console.log(`📧 Invitation envoyée à ${email} avec le mot de passe: ${tempPassword}`);

      return createdResponse(newUser, "Invitation envoyée avec succès");
    } catch (error: any) {
      console.error("❌ User create error:", error);
      return errorResponse(
        error.message || "Erreur lors de la création de l'utilisateur",
        500
      );
    }
  }

  // ============================================
  // DÉTAIL D'UN UTILISATEUR
  // ============================================
  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!targetUser) {
        return notFoundResponse("Utilisateur non trouvé");
      }

      return successResponse(targetUser);
    } catch (error: any) {
      console.error("❌ User show error:", error);
      return errorResponse(
        error.message || "Erreur lors de la récupération de l'utilisateur",
        500
      );
    }
  }

  // ============================================
  // MODIFIER UN UTILISATEUR
  // ============================================
  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const targetUser = await prisma.user.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!targetUser) {
        return notFoundResponse("Utilisateur non trouvé");
      }

      // Empêcher la modification de son propre rôle admin
      if (targetUser.id === user.id && body.role && body.role !== targetUser.role) {
        return errorResponse("Vous ne pouvez pas modifier votre propre rôle", 400);
      }

      // ✅ Préparer les données à mettre à jour avec les enums
      const updateData: any = {};
      if (body.firstName) updateData.firstName = body.firstName;
      if (body.lastName) updateData.lastName = body.lastName;
      if (body.phone !== undefined) updateData.phone = body.phone;
      if (body.role && body.role in UserRole) updateData.role = body.role as UserRole;
      if (body.status && body.status in UserStatus) updateData.status = body.status as UserStatus;

      const updated = await prisma.user.update({
        where: { id: targetUser.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
        },
      });

      return successResponse(updated, "Utilisateur modifié avec succès");
    } catch (error: any) {
      console.error("❌ User update error:", error);
      return errorResponse(
        error.message || "Erreur lors de la modification de l'utilisateur",
        500
      );
    }
  }

  // ============================================
  // SUPPRIMER UN UTILISATEUR
  // ============================================
  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!targetUser) {
        return notFoundResponse("Utilisateur non trouvé");
      }

      // Empêcher la suppression de soi-même
      if (targetUser.id === user.id) {
        return errorResponse("Vous ne pouvez pas supprimer votre propre compte", 400);
      }

      // Empêcher la suppression du dernier admin
      const adminCount = await prisma.user.count({
        where: {
          companyId: user.companyId,
          role: UserRole.admin,
          status: UserStatus.active,
        },
      });

      if (targetUser.role === UserRole.admin && adminCount <= 1) {
        return errorResponse("L'entreprise doit avoir au moins un administrateur", 400);
      }

      await prisma.user.delete({
        where: { id: targetUser.id },
      });

      return successResponse(null, "Utilisateur supprimé avec succès");
    } catch (error: any) {
      console.error("❌ User delete error:", error);
      return errorResponse(
        error.message || "Erreur lors de la suppression de l'utilisateur",
        500
      );
    }
  }
}