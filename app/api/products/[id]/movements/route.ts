// src/app/api/products/[id]/movements/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    // Vérifier que le produit appartient à l'entreprise
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        companyId: user.companyId,
      },
    });

    if (!product) {
      return notFoundResponse("Produit non trouvé");
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: {
          productId: params.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          sale: {
            select: {
              id: true,
              reference: true,
            },
          },
        },
      }),
      prisma.stockMovement.count({
        where: {
          productId: params.id,
        },
      }),
    ]);

    return successResponse({
      movements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Movements error:", error);
    return errorResponse("Erreur lors de la récupération des mouvements de stock", 500);
  }
}

// POST - Ajouter un mouvement de stock (entrée/sortie manuelle)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const body = await req.json();
    const { quantity, type, reason } = body;

    // Vérifier que le produit appartient à l'entreprise
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        companyId: user.companyId,
      },
    });

    if (!product) {
      return notFoundResponse("Produit non trouvé");
    }

    // Pour une sortie, vérifier le stock
    if (quantity < 0 && product.stockQuantity < Math.abs(quantity)) {
      return errorResponse("Stock insuffisant", 400);
    }

    const beforeStock = product.stockQuantity;
    const afterStock = beforeStock + quantity;

    const movement = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le stock
      await tx.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: afterStock,
        },
      });

      // 2. Créer le mouvement
      return tx.stockMovement.create({
        data: {
          productId: product.id,
          userId: user.id,
          quantity,
          type: type || "adjustment",
          beforeStock,
          afterStock,
          reason: reason || "Ajustement manuel",
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });

    return successResponse(movement, "Mouvement de stock enregistré avec succès");
  } catch (error: any) {
    console.error("Movement create error:", error);
    return errorResponse("Erreur lors de l'enregistrement du mouvement", 500);
  }
}