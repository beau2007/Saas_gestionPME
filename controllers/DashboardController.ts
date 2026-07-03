// controllers/DashboardController.ts
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export class DashboardController {
  static async getStats(user: any, period: string = "month") {
    try {
      const companyId = user.companyId;
      const now = new Date();
      let startDate = new Date();

      // Déterminer la période pour le graphique
      switch (period) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }

      // Récupérer les données pour le graphique
      const salesData = await prisma.sale.findMany({
        where: {
          companyId,
          saleDate: { gte: startDate },
          status: "completed",
        },
        select: {
          saleDate: true,
          total: true,
        },
        orderBy: { saleDate: "asc" },
      });

      // Grouper par jour pour la semaine, par mois pour les autres périodes
      const groupedData: Record<string, { total: number; count: number }> = {};
      
      salesData.forEach((sale) => {
        let key: string;
        if (period === "week") {
          // Grouper par jour
          key = sale.saleDate.toISOString().split("T")[0];
        } else {
          // Grouper par mois
          key = `${sale.saleDate.getFullYear()}-${String(sale.saleDate.getMonth() + 1).padStart(2, "0")}`;
        }
        
        if (!groupedData[key]) {
          groupedData[key] = { total: 0, count: 0 };
        }
        groupedData[key].total += sale.total;
        groupedData[key].count += 1;
      });

      const chartData = Object.entries(groupedData).map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      }));

      // Statistiques générales
      const [
        totalSales,
        totalRevenue,
        totalClients,
        totalProducts,
        lowStockProducts,
        monthlyRevenue,
        recentSales,
        recentClients,
      ] = await Promise.all([
        prisma.sale.count({ where: { companyId } }),
        prisma.sale.aggregate({
          where: { companyId },
          _sum: { total: true },
        }),
        prisma.client.count({ where: { companyId } }),
        prisma.product.count({ where: { companyId } }),
        prisma.product.count({
          where: {
            companyId,
            stockQuantity: {
              lte: prisma.product.fields.stockMin,
            },
          },
        }),
        prisma.sale.aggregate({
          where: {
            companyId,
            saleDate: {
              gte: new Date(now.getFullYear(), now.getMonth(), 1),
            },
          },
          _sum: { total: true },
        }),
        prisma.sale.findMany({
          where: { companyId },
          orderBy: { saleDate: "desc" },
          take: 5,
          include: {
            client: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.client.findMany({
          where: { companyId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

      return successResponse({
        stats: {
          totalSales,
          totalRevenue: totalRevenue._sum.total || 0,
          totalClients,
          totalProducts,
          lowStockProducts,
          monthlyRevenue: monthlyRevenue._sum.total || 0,
        },
        recentActivities: {
          sales: recentSales,
          clients: recentClients,
        },
        salesChart: {
          period,
          data: chartData.length > 0 ? chartData : [],
        },
      });
    } catch (error: any) {
      console.error("Dashboard stats error:", error);
      return errorResponse("Erreur lors de la récupération des statistiques", 500);
    }
  }

  static async getDailySales(user: any) {
    try {
      const companyId = user.companyId;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sales = await prisma.sale.groupBy({
        by: ["saleDate"],
        where: {
          companyId,
          saleDate: { gte: today },
        },
        _sum: {
          total: true,
        },
        _count: true,
      });

      return successResponse(sales);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération des ventes du jour", 500);
    }
  }
}