// controllers/ReportController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { PaymentMethod, SaleStatus } from "@prisma/client";

export class ReportController {
  static async getStats(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const period = searchParams.get("period") || "month";
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      const companyId = user.companyId;
      const now = new Date();
      let startDate = new Date();

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

      // ✅ Helper pour convertir les BigInt en Number
      const toNumber = (value: any): number => {
        if (typeof value === 'bigint') return Number(value);
        if (typeof value === 'number') return value;
        return 0;
      };

      // Statistiques
      const [sales, totalRevenue, totalClients, totalProducts] = await Promise.all([
        prisma.sale.count({
          where: {
            companyId,
            saleDate: { gte: startDate },
            status: "completed",
          },
        }),
        prisma.sale.aggregate({
          where: {
            companyId,
            saleDate: { gte: startDate },
            status: "completed",
          },
          _sum: { total: true },
        }),
        prisma.client.count({
          where: {
            companyId,
            createdAt: { gte: startDate },
          },
        }),
        prisma.product.count({
          where: { companyId },
        }),
      ]);

      // Ventes du mois précédent pour comparaison
      const previousStart = new Date(startDate);
      previousStart.setMonth(previousStart.getMonth() - 1);
      const previousRevenue = await prisma.sale.aggregate({
        where: {
          companyId,
          saleDate: {
            gte: previousStart,
            lt: startDate,
          },
          status: "completed",
        },
        _sum: { total: true },
      });

      const previousSales = await prisma.sale.count({
        where: {
          companyId,
          saleDate: {
            gte: previousStart,
            lt: startDate,
          },
          status: "completed",
        },
      });

      // Graphique
      const chartData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', "saleDate") as date,
          COUNT(*) as count,
          SUM("total") as total
        FROM "sales"
        WHERE 
          "companyId" = ${companyId}
          AND "saleDate" >= ${startDate}
          AND "status" = 'completed'
        GROUP BY DATE_TRUNC('day', "saleDate")
        ORDER BY date ASC
      `;

      const chart = (chartData as any[]).reduce(
        (acc, item) => {
          acc.labels.push(new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }));
          acc.values.push(toNumber(item.total));
          return acc;
        },
        { labels: [], values: [] } as { labels: string[]; values: number[] }
      );

      // Top produits
      const topProducts = await prisma.$queryRaw`
        SELECT 
          p.id,
          p.name,
          p.reference,
          SUM(si.quantity) as "totalSold",
          SUM(si.total) as revenue
        FROM "sale_items" si
        JOIN "sales" s ON s.id = si."saleId"
        JOIN "products" p ON p.id = si."productId"
        WHERE 
          s."companyId" = ${companyId}
          AND s."saleDate" >= ${startDate}
          AND s."status" = 'completed'
        GROUP BY p.id, p.name, p.reference
        ORDER BY revenue DESC
        LIMIT 5
      `;

      // Top clients
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
          AND s."saleDate" >= ${startDate}
          AND s."status" = 'completed'
        GROUP BY c.id, c."firstName", c."lastName", c.email
        ORDER BY "totalSpent" DESC
        LIMIT 5
      `;

      // Répartition par catégorie
      const categoryBreakdown = await prisma.$queryRaw`
        SELECT 
          p.category,
          SUM(si.total) as total
        FROM "sale_items" si
        JOIN "sales" s ON s.id = si."saleId"
        JOIN "products" p ON p.id = si."productId"
        WHERE 
          s."companyId" = ${companyId}
          AND s."saleDate" >= ${startDate}
          AND s."status" = 'completed'
          AND p.category IS NOT NULL
        GROUP BY p.category
        ORDER BY total DESC
      `;

      // Répartition par moyen de paiement
      const paymentBreakdown = await prisma.$queryRaw`
        SELECT 
          "paymentMethod" as method,
          COUNT(*) as count,
          SUM(total) as total
        FROM "sales"
        WHERE 
          "companyId" = ${companyId}
          AND "saleDate" >= ${startDate}
          AND "status" = 'completed'
        GROUP BY "paymentMethod"
        ORDER BY total DESC
      `;

      // Liste des ventes
      const salesList = await prisma.sale.findMany({
        where: {
          companyId,
          saleDate: { gte: startDate },
        },
        orderBy: { saleDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          client: true,
        },
      });

      const totalSalesCount = await prisma.sale.count({
        where: {
          companyId,
          saleDate: { gte: startDate },
        },
      });

      // ✅ Conversion des BigInt en Number
      const totalRevenueValue = toNumber(totalRevenue._sum.total);
      const previousRevenueValue = toNumber(previousRevenue._sum.total);
      const revenueChange = previousRevenueValue > 0
        ? ((totalRevenueValue - previousRevenueValue) / previousRevenueValue) * 100
        : 0;

      const salesChange = previousSales > 0
        ? ((sales - previousSales) / previousSales) * 100
        : 0;

      // ✅ Conversion des topProducts
      const formattedTopProducts = (topProducts as any[]).map((p) => ({
        ...p,
        totalSold: toNumber(p.totalSold),
        revenue: toNumber(p.revenue),
      }));

      // ✅ Conversion des topClients
      const formattedTopClients = (topClients as any[]).map((c) => ({
        ...c,
        totalSpent: toNumber(c.totalSpent),
        totalOrders: toNumber(c.totalOrders),
      }));

      // ✅ Conversion des catégories
      const formattedCategories = (categoryBreakdown as any[]).map((c) => ({
        category: c.category,
        total: toNumber(c.total),
      }));

      // ✅ Conversion des paiements
      const formattedPayments = (paymentBreakdown as any[]).map((p) => ({
        method: p.method,
        total: toNumber(p.total),
        count: toNumber(p.count),
      }));

      return successResponse({
        stats: {
          totalRevenue: totalRevenueValue,
          totalSales: sales,
          averageOrderValue: sales > 0 ? totalRevenueValue / sales : 0,
          totalClients,
          totalProducts,
          revenueChange: Math.round(revenueChange),
          salesChange: Math.round(salesChange),
        },
        chart,
        topProducts: formattedTopProducts,
        topClients: formattedTopClients,
        breakdown: {
          categories: formattedCategories,
          payments: formattedPayments,
        },
        sales: salesList.map((sale) => ({
          id: sale.id,
          reference: sale.reference,
          clientName: sale.client
            ? `${sale.client.firstName} ${sale.client.lastName}`
            : "Client inconnu",
          total: toNumber(sale.total),
          status: sale.status,
          paymentMethod: sale.paymentMethod,
          saleDate: sale.saleDate,
        })),
        pagination: {
          total: totalSalesCount,
          page,
          limit,
          totalPages: Math.ceil(totalSalesCount / limit),
        },
      });
    } catch (error: any) {
      console.error("Report error:", error);
      return errorResponse("Erreur lors de la génération du rapport", 500);
    }
  }
}