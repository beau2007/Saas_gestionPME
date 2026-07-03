// src/controllers/InvoiceController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";

export class InvoiceController {
  // ============================================
  // LISTE DES FACTURES
  // ============================================
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const status = searchParams.get("status");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const search = searchParams.get("search");

      const companyId = user.companyId;
      const where: any = { companyId };

      if (status && status !== "all") {
        where.status = status;
      }

      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          { client: { firstName: { contains: search, mode: "insensitive" } } },
          { client: { lastName: { contains: search, mode: "insensitive" } } },
        ];
      }

      if (startDate && endDate) {
        where.invoiceDate = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { invoiceDate: "desc" },
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
            sale: {
              select: {
                id: true,
                reference: true,
              },
            },
          },
        }),
        prisma.invoice.count({ where }),
      ]);

      // Calculer les totaux
      const totals = await prisma.invoice.aggregate({
        where,
        _sum: {
          total: true,
        },
      });

      // Compter par statut
      const statusCounts = await prisma.invoice.groupBy({
        by: ["status"],
        where: { companyId },
        _count: true,
      });

      return successResponse({
        invoices,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        totals: {
          totalAmount: Number(totals._sum.total || 0),
        },
        statusCounts,
      });
    } catch (error: any) {
      console.error("Invoice index error:", error);
      return errorResponse("Erreur lors de la récupération des factures", 500);
    }
  }

  // ============================================
  // DÉTAIL D'UNE FACTURE
  // ============================================
  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          client: true,
          sale: {
            include: {
              saleItems: {
                include: {
                  product: true,
                },
              },
            },
          },
          company: true,
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      return successResponse(invoice);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération de la facture", 500);
    }
  }

  // ============================================
  // CRÉER UNE FACTURE
  // ============================================
  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      const { clientId, saleId, dueDate, notes, footerText } = body;

      // Récupérer les paramètres de l'entreprise
      const settings = await prisma.settings.findUnique({
        where: { companyId: user.companyId },
      });

      let saleData = null;
      let subtotal = 0;
      let taxAmount = 0;
      let total = 0;

      if (saleId) {
        // Facture à partir d'une vente
        saleData = await prisma.sale.findUnique({
          where: {
            id: saleId,
            companyId: user.companyId,
          },
          include: {
            saleItems: {
              include: {
                product: true,
              },
            },
            client: true,
          },
        });

        if (!saleData) {
          return errorResponse("Vente non trouvée", 404);
        }

        if (saleData.invoiceId) {
          return errorResponse("Cette vente a déjà une facture", 400);
        }

        subtotal = Number((saleData.subtotal as any).toString());
        taxAmount = Number((saleData.taxAmount as any).toString());
        total = Number((saleData.total as any).toString());
      } else {
        // Facture manuelle (à partir du client)
        if (!clientId) {
          return errorResponse("Client requis", 400);
        }

        // Vérifier que le client existe
        const client = await prisma.client.findUnique({
          where: {
            id: clientId,
            companyId: user.companyId,
          },
        });

        if (!client) {
          return errorResponse("Client non trouvé", 404);
        }
      }

      // Générer le numéro de facture
      const prefix = settings?.invoicePrefix || "FACT-";
      const nextNumber = settings?.invoiceNextNumber || 1;
      const invoiceNumber = `${prefix}${String(nextNumber).padStart(4, "0")}`;

      // Créer la facture
      const invoice = await prisma.$transaction(async (tx) => {
        // 1. Créer la facture
        const newInvoice = await tx.invoice.create({
          data: {
            companyId: user.companyId,
            clientId: clientId || saleData?.clientId,
            saleId: saleId || null,
            invoiceNumber,
            invoiceDate: new Date(),
            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            subtotal,
            taxAmount,
            total,
            status: "draft",
            notes,
            footerText: footerText || settings?.invoiceFooter || "",
          },
          include: {
            client: true,
            sale: {
              include: {
                saleItems: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        // 2. Mettre à jour le compteur
        await tx.settings.update({
          where: { companyId: user.companyId },
          data: { invoiceNextNumber: nextNumber + 1 },
        });

        // 3. Lier la facture à la vente
        if (saleId) {
          await tx.sale.update({
            where: { id: saleId },
            data: { invoiceId: newInvoice.id },
          });
        }

        return newInvoice;
      });

      return createdResponse(invoice, "Facture créée avec succès");
    } catch (error: any) {
      console.error("Invoice create error:", error);
      return errorResponse("Erreur lors de la création de la facture", 500);
    }
  }

  // ============================================
  // MODIFIER UNE FACTURE
  // ============================================
  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      // Empêcher la modification d'une facture payée
      if (invoice.status === "paid") {
        return errorResponse("Une facture payée ne peut pas être modifiée", 400);
      }

      const updated = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: body.status,
          dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
          notes: body.notes,
          footerText: body.footerText,
        },
        include: {
          client: true,
        },
      });

      return successResponse(updated, "Facture modifiée avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification de la facture", 500);
    }
  }

  // ============================================
  // SUPPRIMER UNE FACTURE
  // ============================================
  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      if (invoice.status === "paid") {
        return errorResponse("Une facture payée ne peut pas être supprimée", 400);
      }

      if (invoice.status === "sent") {
        return errorResponse("Une facture envoyée ne peut pas être supprimée", 400);
      }

      await prisma.invoice.delete({
        where: { id: invoice.id },
      });

      return successResponse(null, "Facture supprimée avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la suppression de la facture", 500);
    }
  }

  // ============================================
  // MARQUER COMME PAYÉE
  // ============================================
  static async markAsPaid(user: any, req: NextRequest, params: { id: string }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      if (invoice.status === "paid") {
        return errorResponse("Cette facture est déjà payée", 400);
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updatedInvoice = await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            status: "paid",
            paidAt: new Date(),
          },
        });

        // Mettre à jour la vente associée
        if (invoice.saleId) {
          await tx.sale.update({
            where: { id: invoice.saleId },
            data: {
              paymentStatus: "paid",
              paymentDate: new Date(),
            },
          });
        }

        return updatedInvoice;
      });

      return successResponse(updated, "Facture marquée comme payée");
    } catch (error: any) {
      return errorResponse("Erreur lors du marquage de la facture", 500);
    }
  }

  // ============================================
  // ENVOYER PAR EMAIL
  // ============================================
  static async sendByEmail(user: any, req: NextRequest, params: { id: string }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          client: true,
          company: true,
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      if (!invoice.client?.email) {
        return errorResponse("Le client n'a pas d'email", 400);
      }

      // Ici, tu implémentes l'envoi d'email
      // await sendInvoiceEmail(invoice.client.email, invoice);

      // Mettre à jour le statut
      const updated = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });

      return successResponse(updated, "Facture envoyée par email avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de l'envoi de la facture", 500);
    }
  }

  // ============================================
  // GÉNÉRER LE PDF
  // ============================================
  static async generatePDF(user: any, req: NextRequest, params: { id: string }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          client: true,
          company: true,
          sale: {
            include: {
              saleItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!invoice) {
        return notFoundResponse("Facture non trouvée");
      }

      // Ici, tu implémentes la génération PDF avec une librairie comme jsPDF ou @react-pdf/renderer

      return successResponse({
        invoice,
        downloadUrl: `/api/invoices/${invoice.id}/pdf`,
      }, "PDF généré avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la génération du PDF", 500);
    }
  }
}