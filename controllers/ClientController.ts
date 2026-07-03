// controllers/ClientController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "@/lib/response";

export class ClientController {
  static async index(user: any, req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search");
      const category = searchParams.get("category");

      const companyId = user.companyId;
      const where: any = { companyId };

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category) {
        where.category = category;
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                sales: true,
              },
            },
          },
        }),
        prisma.client.count({ where }),
      ]);

      return successResponse({
        clients,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Client index error:", error);
      return errorResponse("Erreur lors de la récupération des clients", 500);
    }
  }

  static async show(user: any, req: NextRequest, params: { id: string }) {
    try {
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          sales: {
            orderBy: { saleDate: "desc" },
            take: 10,
            include: {
              saleItems: {
                include: {
                  product: true,
                },
              },
            },
          },
          invoices: {
            orderBy: { invoiceDate: "desc" },
            take: 5,
          },
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      return successResponse(client);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération du client", 500);
    }
  }

  static async create(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      const client = await prisma.client.create({
        data: {
          companyId: user.companyId,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          city: body.city,
          postalCode: body.postalCode,
          country: body.country || "France",
          companyName: body.companyName,
          siret: body.siret,
          vatNumber: body.vatNumber,
          notes: body.notes,
          category: body.category,
          tags: body.tags || [],
        },
      });

      return createdResponse(client, "Client créé avec succès");
    } catch (error: any) {
      console.error("Client create error:", error);
      return errorResponse("Erreur lors de la création du client", 500);
    }
  }

  static async update(user: any, req: NextRequest, params: { id: string }) {
    try {
      const body = await req.json();
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      const updated = await prisma.client.update({
        where: { id: client.id },
        data: body,
      });

      return successResponse(updated, "Client modifié avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification du client", 500);
    }
  }

  static async delete(user: any, req: NextRequest, params: { id: string }) {
    try {
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          companyId: user.companyId,
        },
        include: {
          _count: {
            select: {
              sales: true,
              invoices: true,
            },
          },
        },
      });

      if (!client) {
        return notFoundResponse("Client non trouvé");
      }

      if (client._count.sales > 0 || client._count.invoices > 0) {
        return errorResponse("Ce client a des ventes ou factures associées, vous ne pouvez pas le supprimer", 400);
      }

      await prisma.client.delete({
        where: { id: client.id },
      });

      return successResponse(null, "Client supprimé avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la suppression du client", 500);
    }
  }
}