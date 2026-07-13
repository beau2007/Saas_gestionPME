// controllers/ClientController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";
import { ClientStatus } from "@prisma/client";

export class ClientController {
  // ============================================
  // 1. LISTE DES CLIENTS (avec stats)
  // ============================================
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
      const search = searchParams.get("search") || "";
      const status = searchParams.get("status") || "all";
      const category = searchParams.get("category") || "all";

      const companyId = user.companyId;
      const where: any = { companyId };

      // ✅ Filtre par recherche
      if (search && search.trim() !== "") {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
        ];
      }

      // ✅ Filtre par statut
      if (status && status !== "all") {
        const validStatuses = ["active", "inactive"];
        if (validStatuses.includes(status)) {
          where.status = status as ClientStatus;
        }
      }

      // ✅ Filtre par catégorie
      if (category && category !== "all") {
        where.category = category;
      }

      // ✅ Exécuter les requêtes
      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                sales: true,
                invoices: true,
              },
            },
          },
        }),
        prisma.client.count({ where }),
      ]);

      // ✅ Statistiques pour les cartes
      const [totalCount, activeCount, inactiveCount, newThisMonth] = await Promise.all([
        prisma.client.count({ where: { companyId } }),
        prisma.client.count({ where: { companyId, status: ClientStatus.active } }),
        prisma.client.count({ where: { companyId, status: ClientStatus.inactive } }),
        prisma.client.count({
          where: {
            companyId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      ]);

      // ✅ Récupérer les catégories existantes
      const categories = await prisma.client.findMany({
        where: { companyId },
        distinct: ["category"],
        select: { category: true },
      });

      return successResponse({
        clients,
        categories: categories.map((c) => c.category).filter(Boolean),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          total: totalCount,
          active: activeCount,
          inactive: inactiveCount,
          newThisMonth,
        },
      });
    } catch (error: any) {
      console.error("❌ Client index error:", error);
      return errorResponse("Erreur lors de la récupération des clients", 500);
    }
  }

  // ============================================
  // 2. DÉTAIL D'UN CLIENT
  // ============================================
  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          sales: {
            orderBy: { saleDate: "desc" },
            take: 10,
            include: {
              saleItems: {
                include: {
                  product: true,
                },
              },
            },
          },
          invoices: {
            orderBy: { invoiceDate: "desc" },
            take: 5,
          },
          _count: {
            select: {
              sales: true,
              invoices: true,
            },
          },
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      // ✅ Calculer le total des achats
      const totalPurchases = client.sales.reduce((sum, sale) => sum + sale.total, 0);

      return successResponse({
        ...client,
        totalPurchases,
      });
    } catch (error: any) {
      console.error("❌ Client show error:", error);
      return errorResponse("Erreur lors de la récupération du client", 500);
    }
  }

  // ============================================
  // 3. CRÉER UN CLIENT
  // ============================================
  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();

      // ✅ Validation des champs requis
      if (!body.firstName || !body.lastName) {
        return errorResponse("Le prénom et le nom sont requis", 400);
      }

      // ✅ Vérifier si l'email existe déjà (si fourni)
      if (body.email) {
        const existing = await prisma.client.findFirst({
          where: {
            companyId: user.companyId,
            email: body.email,
          },
        });
        if (existing) {
          return errorResponse("Un client avec cet email existe déjà", 400);
        }
      }

      const client = await prisma.client.create({
        data: {
          companyId: user.companyId,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email || null,
          phone: body.phone || null,
          address: body.address || null,
          city: body.city || null,
          postalCode: body.postalCode || null,
          country: body.country || "France",
          companyName: body.companyName || null,
          siret: body.siret || null,
          vatNumber: body.vatNumber || null,
          notes: body.notes || null,
          category: body.category || "particulier",
          tags: body.tags || [],
          status: ClientStatus.active,
        },
      });

      return createdResponse(client, "Client créé avec succès");
    } catch (error: any) {
      console.error("❌ Client create error:", error);
      return errorResponse("Erreur lors de la création du client", 500);
    }
  }

  // ============================================
  // 4. MODIFIER UN CLIENT
  // ============================================
  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      // ✅ Vérifier si l'email est déjà utilisé par un autre client
      if (body.email) {
        const existing = await prisma.client.findFirst({
          where: {
            companyId: user.companyId,
            email: body.email,
            id: { not: client.id },
          },
        });
        if (existing) {
          return errorResponse("Un autre client avec cet email existe déjà", 400);
        }
      }

      // ✅ Mettre à jour uniquement les champs fournis
      const updateData: any = {};
      if (body.firstName !== undefined) updateData.firstName = body.firstName;
      if (body.lastName !== undefined) updateData.lastName = body.lastName;
      if (body.email !== undefined) updateData.email = body.email || null;
      if (body.phone !== undefined) updateData.phone = body.phone || null;
      if (body.address !== undefined) updateData.address = body.address || null;
      if (body.city !== undefined) updateData.city = body.city || null;
      if (body.postalCode !== undefined) updateData.postalCode = body.postalCode || null;
      if (body.country !== undefined) updateData.country = body.country || "France";
      if (body.companyName !== undefined) updateData.companyName = body.companyName || null;
      if (body.siret !== undefined) updateData.siret = body.siret || null;
      if (body.vatNumber !== undefined) updateData.vatNumber = body.vatNumber || null;
      if (body.notes !== undefined) updateData.notes = body.notes || null;
      if (body.category !== undefined) updateData.category = body.category || "particulier";
      if (body.tags !== undefined) updateData.tags = body.tags || [];
      if (body.status !== undefined) {
        const validStatuses = ["active", "inactive"];
        if (validStatuses.includes(body.status)) {
          updateData.status = body.status as ClientStatus;
        }
      }

      const updated = await prisma.client.update({
        where: { id: client.id },
        data: updateData,
      });

      return successResponse(updated, "Client modifié avec succès");
    } catch (error: any) {
      console.error("❌ Client update error:", error);
      return errorResponse("Erreur lors de la modification du client", 500);
    }
  }

  // ============================================
  // 5. SUPPRIMER UN CLIENT
  // ============================================
  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          _count: {
            select: {
              sales: true,
              invoices: true,
            },
          },
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      // ✅ Empêcher la suppression si le client a des ventes
      if (client._count.sales > 0) {
        return errorResponse(
          "Ce client a des ventes associées. Vous ne pouvez pas le supprimer, vous pouvez le désactiver.",
          400
        );
      }

      // ✅ Si le client a des factures mais pas de ventes
      if (client._count.invoices > 0) {
        return errorResponse(
          "Ce client a des factures associées. Vous ne pouvez pas le supprimer, vous pouvez le désactiver.",
          400
        );
      }

      await prisma.client.delete({
        where: { id: client.id },
      });

      return successResponse(null, "Client supprimé avec succès");
    } catch (error: any) {
      console.error("❌ Client delete error:", error);
      return errorResponse("Erreur lors de la suppression du client", 500);
    }
  }

  // ============================================
  // 6. STATISTIQUES RAPIDES (optionnel)
  // ============================================
  static async getStats(user: any) {
    try {
      const companyId = user.companyId;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, active, inactive, newThisMonth] = await Promise.all([
        prisma.client.count({ where: { companyId } }),
        prisma.client.count({ where: { companyId, status: ClientStatus.active } }),
        prisma.client.count({ where: { companyId, status: ClientStatus.inactive } }),
        prisma.client.count({
          where: {
            companyId,
            createdAt: { gte: startOfMonth },
          },
        }),
      ]);

      // ✅ Top clients par dépenses
      const topClients = await prisma.$queryRaw`
        SELECT 
          c.id,
          c."firstName",
          c."lastName",
          c.email,
          SUM(s.total) as "totalSpent",
          COUNT(s.id) as "totalOrders"
        FROM "clients" c
        JOIN "sales" s ON s."clientId" = c.id
        WHERE 
          s."companyId" = ${companyId}
          AND s."status" = 'completed'
        GROUP BY c.id, c."firstName", c."lastName", c.email
        ORDER BY "totalSpent" DESC
        LIMIT 5
      `;

      return successResponse({
        stats: {
          total,
          active,
          inactive,
          newThisMonth,
        },
        topClients: (topClients as any[]).map((c) => ({
          ...c,
          totalSpent: Number(c.totalSpent) || 0,
          totalOrders: Number(c.totalOrders) || 0,
        })),
      });
    } catch (error: any) {
      console.error("❌ Client stats error:", error);
      return errorResponse("Erreur lors de la récupération des statistiques", 500);
    }
  }
}