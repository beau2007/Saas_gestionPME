// src/app/api/products/categories/route.ts
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

    const categories = await prisma.product.findMany({
      where: {
        companyId,
        category: {
          not: null,
        },
      },
      distinct: ["category"],
      select: {
        category: true,
      },
    });

    // Compter les produits par catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.product.count({
          where: {
            companyId,
            category: cat.category,
          },
        });
        return {
          name: cat.category,
          count,
        };
      })
    );

    return successResponse({
      categories: categoriesWithCount,
    });
  } catch (error: any) {
    console.error("Categories error:", error);
    return errorResponse("Erreur lors de la récupération des catégories", 500);
  }
}