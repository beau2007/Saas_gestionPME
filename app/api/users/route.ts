// app/api/users/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { UserController } from "@/controllers/UserController";
import { errorResponse } from "@/lib/response";

// GET - Liste des utilisateurs
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.response) {
      return authResult.response;
    }

    const { user } = authResult;
    return UserController.index(user, req);
  } catch (error: any) {
    console.error("❌ GET /api/users error:", error);
    return errorResponse("Erreur serveur", 500);
  }
}

// POST - Créer un utilisateur
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.response) {
      return authResult.response;
    }

    const { user } = authResult;
    return UserController.create(user, req);
  } catch (error: any) {
    console.error("❌ POST /api/users error:", error);
    return errorResponse("Erreur serveur", 500);
  }
}