// src/app/api/auth/change-password/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse("Tous les champs sont requis", 400);
    }

    // Vérifier le mot de passe actuel
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return errorResponse("Utilisateur non trouvé", 404);
    }

    const isValid = await comparePassword(currentPassword, dbUser.password);
    if (!isValid) {
      return errorResponse("Mot de passe actuel incorrect", 400);
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse(null, "Mot de passe modifié avec succès");
  } catch (error: any) {
    return errorResponse("Erreur lors du changement de mot de passe", 500);
  }
}