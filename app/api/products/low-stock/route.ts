// src/app/api/products/low-stock/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const companyId = user.companyId;

    const products = await prisma.product.findMany({
      where: {
        companyId,
        stockQuantity: {
          lte: prisma.product.fields.stockMin,
        },
      },
      orderBy: {
        stockQuantity: "asc",
      },
      select: {
        id: true,
        name: true,
        reference: true,
        stockQuantity: true,
        stockMin: true,
        category: true,
        salePrice: true,
      },
    });

    // Compter les produits en rupture (stock = 0)
    const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
    const lowStock = products.filter((p) => p.stockQuantity > 0).length;

    return successResponse({
      products,
      summary: {
        total: products.length,
        outOfStock,
        lowStock,
      },
    });
  } catch (error: any) {
    console.error("Low stock error:", error);
    return errorResponse("Erreur lors de la récupération des produits en stock faible", 500);
  }
}