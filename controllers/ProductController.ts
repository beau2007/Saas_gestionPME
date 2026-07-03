// controllers/ProductController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";
import { ProductStatus } from "@prisma/client";

export class ProductController {
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
      const search = searchParams.get("search") || "";
      const category = searchParams.get("category") || "all";
      const status = searchParams.get("status") || "all";
      const lowStock = searchParams.get("lowStock") === "true";

      const companyId = user.companyId;
      const where: any = { companyId };

      if (search && search.trim() !== "") {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { reference: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category && category !== "all") {
        where.category = category;
      }

      if (status && status !== "all") {
        where.status = status as ProductStatus;
      }

      if (lowStock) {
        where.stockQuantity = { lte: prisma.product.fields.stockMin };
        where.status = ProductStatus.active;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
      ]);

      // Statistiques
      const categories = await prisma.product.findMany({
        where: { companyId },
        distinct: ["category"],
        select: { category: true },
      });

      const [totalCount, activeCount, lowStockCount, outOfStockCount] = await Promise.all([
        prisma.product.count({ where: { companyId } }),
        prisma.product.count({ where: { companyId, status: ProductStatus.active } }),
        prisma.product.count({
          where: {
            companyId,
            stockQuantity: { lte: prisma.product.fields.stockMin },
            status: ProductStatus.active,
          },
        }),
        prisma.product.count({
          where: {
            companyId,
            stockQuantity: 0,
          },
        }),
      ]);

      return successResponse({
        products,
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
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
        },
      });
    } catch (error: any) {
      console.error("❌ Product index error:", error);
      return errorResponse("Erreur lors de la récupération des produits", 500);
    }
  }

  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      const {
        name,
        reference,
        description,
        purchasePrice,
        salePrice,
        taxRate,
        stockQuantity,
        stockMin,
        category,
        subcategory,
        unit,
      } = body;

      // Vérifier si la référence existe déjà
      const existing = await prisma.product.findUnique({
        where: { reference },
      });

      if (existing) {
        return errorResponse("Cette référence existe déjà", 400);
      }

      const product = await prisma.product.create({
        data: {
          companyId: user.companyId,
          name,
          reference,
          description: description || null,
          purchasePrice: purchasePrice || 0,
          salePrice,
          taxRate: taxRate || 20,
          stockQuantity: stockQuantity || 0,
          stockMin: stockMin || 0,
          category: category || null,
          subcategory: subcategory || null,
          unit: unit || "unité",
          status: stockQuantity > 0 ? ProductStatus.active : ProductStatus.out_of_stock,
        },
      });

      // Si stock initial > 0, créer un mouvement
      if (stockQuantity > 0) {
        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            userId: user.id,
            quantity: stockQuantity,
            type: "purchase",
            beforeStock: 0,
            afterStock: stockQuantity,
            reason: "Stock initial",
          },
        });
      }

      return createdResponse(product, "Produit créé avec succès");
    } catch (error: any) {
      console.error("❌ Product create error:", error);
      return errorResponse("Erreur lors de la création du produit", 500);
    }
  }

  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!product) {
        return notFoundResponse("Produit non trouvé");
      }

      return successResponse(product);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération du produit", 500);
    }
  }

  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const product = await prisma.product.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!product) {
        return notFoundResponse("Produit non trouvé");
      }

      const updateData: any = { ...body };
      
      // Si la quantité change, mettre à jour le statut
      if (body.stockQuantity !== undefined) {
        if (body.stockQuantity === 0) {
          updateData.status = ProductStatus.out_of_stock;
        } else if (body.stockQuantity > 0 && product.status === ProductStatus.out_of_stock) {
          updateData.status = ProductStatus.active;
        }
      }

      const updated = await prisma.product.update({
        where: { id: product.id },
        data: updateData,
      });

      return successResponse(updated, "Produit modifié avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification du produit", 500);
    }
  }

  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!product) {
        return notFoundResponse("Produit non trouvé");
      }

      // Vérifier si le produit a des ventes
      const salesCount = await prisma.saleItem.count({
        where: { productId: product.id },
      });

      if (salesCount > 0) {
        return errorResponse("Ce produit ne peut pas être supprimé car il a des ventes", 400);
      }

      await prisma.product.delete({
        where: { id: product.id },
      });

      return successResponse(null, "Produit supprimé avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la suppression du produit", 500);
    }
  }
}