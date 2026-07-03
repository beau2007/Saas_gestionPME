// app/api/users/[id]/resend-invite/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/response";
import { sendInvitationEmail } from "@/lib/mailer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { user } = authResult;
    
    const targetUser = await prisma.user.findUnique({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!targetUser) {
      return notFoundResponse("Utilisateur non trouvé");
    }

    if (targetUser.status !== "pending") {
      return errorResponse("Cet utilisateur n'est pas en attente d'invitation", 400);
    }

    // Générer un nouveau token
    const verificationToken = generateToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
    });

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { verificationToken },
    });

    // Envoyer l'email
    await sendInvitationEmail(
      targetUser.email,
      `${targetUser.firstName} ${targetUser.lastName}`,
      verificationToken
    );

    return successResponse(null, "Invitation renvoyée avec succès");
  } catch (error: any) {
    console.error("Resend invite error:", error);
    return errorResponse("Erreur lors du renvoi de l'invitation", 500);
  }
}