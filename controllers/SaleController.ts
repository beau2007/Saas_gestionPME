// controllers/SaleController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";

export class SaleController {
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const clientId = searchParams.get("clientId");

      const companyId = user.companyId;
      const where: any = { companyId };

      if (startDate && endDate) {
        where.saleDate = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      if (clientId) {
        where.clientId = clientId;
      }

      const [sales, total] = await Promise.all([
        prisma.sale.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { saleDate: "desc" },
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                status: true,
              },
            },
            saleItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    reference: true,
                  },
                },
              },
            },
          },
        }),
        prisma.sale.count({ where }),
      ]);

      return successResponse({
        sales,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Sale index error:", error);
      return errorResponse("Erreur lors de la récupération des ventes", 500);
    }
  }

  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const sale = await prisma.sale.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          client: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          invoice: true,
          saleItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!sale) {
        return notFoundResponse("Vente non trouvée");
      }

      return successResponse(sale);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération de la vente", 500);
    }
  }

  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      const { clientId, items, paymentMethod, notes } = body;

      let subtotal = 0;
      const saleItems: any[] = [];

      // Vérifier les produits et calculer le total
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
            companyId: user.companyId,
          },
        });

        if (!product) {
          return errorResponse(`Produit ${item.productId} non trouvé`, 400);
        }

        if (product.stockQuantity < item.quantity) {
          return errorResponse(`Stock insuffisant pour ${product.name}`, 400);
        }

        const total = item.unitPrice * item.quantity - (item.discountAmount || 0);
        subtotal += total;

        saleItems.push({
          productId: product.id,
          productName: product.name,
          productReference: product.reference,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || 0,
          total,
        });
      }

      const taxAmount = subtotal * 0.2; // TVA 20%
      const total = subtotal + taxAmount;

      // Créer la vente
      const sale = await prisma.$transaction(async (tx) => {
        // 1. Créer la vente
        const newSale = await tx.sale.create({
          data: {
            companyId: user.companyId,
            clientId: clientId || null,
            userId: user.id,
            reference: `VENTE-${Date.now()}`,
            subtotal,
            taxAmount,
            total,
            paymentMethod,
            status: "completed",
            notes,
            saleItems: {
              create: saleItems,
            },
          },
          include: {
            saleItems: {
              include: {
                product: true,
              },
            },
          },
        });

        // 2. Mettre à jour le stock
        for (const item of saleItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product) {
            const beforeStock = product.stockQuantity;
            const afterStock = beforeStock - item.quantity;

            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: afterStock },
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                userId: user.id,
                saleId: newSale.id,
                quantity: -item.quantity,
                type: "sale",
                beforeStock,
                afterStock,
              },
            });
          }
        }

        return newSale;
      });

      return createdResponse(sale, "Vente créée avec succès");
    } catch (error: any) {
      console.error("Sale create error:", error);
      return errorResponse("Erreur lors de la création de la vente", 500);
    }
  }

  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const sale = await prisma.sale.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!sale) {
        return notFoundResponse("Vente non trouvée");
      }

      const updated = await prisma.sale.update({
        where: { id: sale.id },
        data: {
          status: body.status,
          paymentStatus: body.paymentStatus,
          notes: body.notes,
        },
      });

      return successResponse(updated, "Vente modifiée avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification de la vente", 500);
    }
  }

  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const sale = await prisma.sale.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          saleItems: true,
          stockMovements: true,
        },
      });

      if (!sale) {
        return notFoundResponse("Vente non trouvée");
      }

      if (sale.invoiceId) {
        return errorResponse("Cette vente a une facture associée, supprimez d'abord la facture", 400);
      }

      await prisma.$transaction(async (tx) => {
        // Restaurer le stock
        for (const item of sale.saleItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId || undefined },
          });

          if (product) {
            await tx.product.update({
              where: { id: product.id },
              data: {
                stockQuantity: product.stockQuantity + item.quantity,
              },
            });
          }
        }

        // Supprimer les lignes
        await tx.saleItem.deleteMany({
          where: { saleId: sale.id },
        });

        // Supprimer la vente
        await tx.sale.delete({
          where: { id: sale.id },
        });
      });

      return successResponse(null, "Vente supprimée avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la suppression de la vente", 500);
    }
  }
}