// src/app/api/products/search/route.ts
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
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return successResponse({
        products: [],
        message: "Veuillez saisir au moins 2 caractères",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        companyId: user.companyId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { reference: { contains: query, mode: "insensitive" } },
          { barcode: { contains: query, mode: "insensitive" } },
        ],
        status: "active",
      },
      take: limit,
      select: {
        id: true,
        name: true,
        reference: true,
        salePrice: true,
        stockQuantity: true,
        category: true,
        unit: true,
      },
    });

    return successResponse({
      products,
      total: products.length,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return errorResponse("Erreur lors de la recherche", 500);
  }
}