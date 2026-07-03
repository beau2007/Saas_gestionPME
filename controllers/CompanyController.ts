// controllers/CompanyController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/response";

export class CompanyController {
  static async show(user: any) {
    try {
      const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        include: {
          settings: true,
          _count: {
            select: {
              users: true,
              clients: true,
              products: true,
              sales: true,
              invoices: true,
            },
          },
        },
      });

      if (!company) {
        return notFoundResponse("Entreprise non trouvée");
      }

      return successResponse(company);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération de l'entreprise", 500);
    }
  }

  static async update(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      
      const company = await prisma.company.update({
        where: { id: user.companyId },
        data: {
          name: body.name,
          phone: body.phone,
          address: body.address,
          city: body.city,
          postalCode: body.postalCode,
          country: body.country,
          logoUrl: body.logoUrl,
        },
      });

      return successResponse(company, "Entreprise modifiée avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification de l'entreprise", 500);
    }
  }

  static async getSettings(user: any) {
    try {
      const settings = await prisma.settings.findUnique({
        where: { companyId: user.companyId },
      });

      if (!settings) {
        return notFoundResponse("Paramètres non trouvés");
      }

      return successResponse(settings);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération des paramètres", 500);
    }
  }

  static async updateSettings(user: any, req: NextRequest) {
    try {
      const body = await req.json();
      
      const settings = await prisma.settings.update({
        where: { companyId: user.companyId },
        data: {
          currency: body.currency,
          taxDefault: body.taxDefault,
          taxIncluded: body.taxIncluded,
          invoicePrefix: body.invoicePrefix,
          invoiceFooter: body.invoiceFooter,
          receiptFooter: body.receiptFooter,
          language: body.language,
          timezone: body.timezone,
          emailNotifications: body.emailNotifications,
          smsNotifications: body.smsNotifications,
          primaryColor: body.primaryColor,
          logoUrl: body.logoUrl,
          modules: body.modules,
        },
      });

      return successResponse(settings, "Paramètres modifiés avec succès");
    } catch (error: any) {
      return errorResponse("Erreur lors de la modification des paramètres", 500);
    }
  }

  static async getSubscription(user: any) {
    try {
      const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        select: {
          subscriptionPlan: true,
          subscriptionStart: true,
          subscriptionEnd: true,
          subscriptionStatus: true,
          isTrial: true,
          trialEnd: true,
        },
      });

      if (!company) {
        return notFoundResponse("Entreprise non trouvée");
      }

      return successResponse(company);
    } catch (error: any) {
      return errorResponse("Erreur lors de la récupération de l'abonnement", 500);
    }
  }
}