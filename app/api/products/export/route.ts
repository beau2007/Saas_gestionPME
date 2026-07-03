// src/app/api/products/export/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/response";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const products = await prisma.product.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (format === "json") {
      return new Response(JSON.stringify(products), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="products.json"',
        },
      });
    }

    // Format CSV
    const headers = [
      "Référence",
      "Nom",
      "Description",
      "Catégorie",
      "Prix Achat",
      "Prix Vente",
      "TVA",
      "Stock",
      "Stock Min",
      "Unité",
      "Code-barres",
    ];

    const rows = products.map((p) => [
      p.reference,
      p.name,
      p.description || "",
      p.category || "",
      p.purchasePrice.toString(),
      p.salePrice.toString(),
      p.taxRate.toString(),
      p.stockQuantity.toString(),
      p.stockMin.toString(),
      p.unit || "unité",
      p.barcode || "",
    ]);

    const csv = [
      headers.join(";"),
      ...rows.map((row) => row.join(";")),
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="products.csv"',
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return errorResponse("Erreur lors de l'exportation des produits", 500);
  }
}