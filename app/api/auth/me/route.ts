// src/app/api/auth/me/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { AuthController } from "@/controllers/AuthController";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  // Attacher l'utilisateur à la requête pour le contrôleur
  (req as any).user = authResult.user;
  return AuthController.me(req);
}