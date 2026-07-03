// controllers/AdminController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export class AdminController {
  static async getCompanies(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search");
      const status = searchParams.get("status");

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status) {
        where.status = status;
      }

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                users: true,
                clients: true,
                products: true,
                sales: true,
              },
            },
          },
        }),
        prisma.company.count({ where }),
      ]);

      return successResponse({
        companies,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Admin getCompanies error:", error);
      return errorResponse("Erreur lors de la récupération des entreprises", 500);
    }
  }

  static async getStats() {
    try {
      const [
        totalCompanies,
        totalUsers,
        totalSales,
        totalRevenue,
        activeCompanies,
        pendingCompanies,
      ] = await Promise.all([
        prisma.company.count(),
        prisma.user.count(),
        prisma.sale.count(),
        prisma.sale.aggregate({
          _sum: { total: true },
        }),
        prisma.company.count({
          where: { status: "active" },
        }),
        prisma.company.count({
          where: { subscriptionStatus: "expired" },
        }),
      ]);

      // Ventes par mois (derniers 12 mois)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const monthlySales = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "saleDate") as month,
          COUNT(*) as count,
          SUM("total") as total
        FROM "sales"
        WHERE "saleDate" >= ${startDate}
        GROUP BY DATE_TRUNC('month', "saleDate")
        ORDER BY month ASC
      `;

      return successResponse({
        stats: {
          totalCompanies,
          totalUsers,
          totalSales,
          totalRevenue: totalRevenue._sum.total || 0,
          activeCompanies,
          pendingCompanies,
        },
        monthlySales,
      });
    } catch (error: any) {
      console.error("Admin stats error:", error);
      return errorResponse("Erreur lors de la récupération des statistiques", 500);
    }
  }

  static async getUsers(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search");
      const role = searchParams.get("role");

      const where: any = {};

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (role) {
        where.role = role;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      return successResponse({
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération des utilisateurs", 500);
    }
  }

  static async toggleCompanyStatus(req: NextRequest, params: { id: string }) {
    try {
      const { action } = await req.json();

      const company = await prisma.company.findUnique({
        where: { id: params.id },
      });

      if (!company) {
        return errorResponse("Entreprise non trouvée", 404);
      }

      let newStatus: "active" | "inactive" | "suspended" = company.status;
      let newSubscriptionStatus = company.subscriptionStatus;

      if (action === "activate") {
        newStatus = "active";
        newSubscriptionStatus = "active";
      } else if (action === "suspend") {
        newStatus = "suspended";
      } else if (action === "deactivate") {
        newStatus = "inactive";
        newSubscriptionStatus = "inactive";
      }

      const updated = await prisma.company.update({
        where: { id: company.id },
        data: {
          status: newStatus,
          subscriptionStatus: newSubscriptionStatus,
        },
      });

      return successResponse(updated, "Statut de l'entreprise modifié avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification du statut", 500);
    }
  }
}