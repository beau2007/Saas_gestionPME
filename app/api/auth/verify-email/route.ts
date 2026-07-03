// src/app/api/auth/verify-email/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return errorResponse("Token manquant", 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return errorResponse("Token invalide", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    return successResponse(null, "Email vérifié avec succès");
  } catch (error: any) {
    return errorResponse("Erreur lors de la vérification de l'email", 500);
  }
}