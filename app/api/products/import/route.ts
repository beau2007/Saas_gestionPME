// src/app/api/products/import/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return errorResponse("Aucun produit à importer", 400);
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of products) {
      try {
        // Vérifier si la référence existe déjà
        const existing = await prisma.product.findUnique({
          where: { reference: item.reference },
        });

        if (existing) {
          results.failed++;
          results.errors.push(`La référence ${item.reference} existe déjà`);
          continue;
        }

        await prisma.product.create({
          data: {
            companyId: user.companyId,
            name: item.name,
            description: item.description || "",
            reference: item.reference,
            purchasePrice: item.purchasePrice || 0,
            salePrice: item.salePrice || 0,
            taxRate: item.taxRate || 20,
            stockQuantity: item.stockQuantity || 0,
            stockMin: item.stockMin || 0,
            category: item.category || "",
            subcategory: item.subcategory || "",
            unit: item.unit || "unité",
            barcode: item.barcode || "",
          },
        });

        results.imported++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Erreur pour ${item.name}: ${error.message}`);
      }
    }

    return successResponse(
      results,
      `${results.imported} produits importés avec succès, ${results.failed} échecs`
    );
  } catch (error: any) {
    console.error("Import error:", error);
    return errorResponse("Erreur lors de l'importation des produits", 500);
  }
}