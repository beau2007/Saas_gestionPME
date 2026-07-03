// app/api/users/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { UserController } from "@/controllers/UserController";
import { errorResponse } from "@/lib/response";

// GET - Détail d'un utilisateur
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(req);
    
    if (authResult.response) {
      return authResult.response;
    }

    const { user } = authResult;
    return UserController.show(user, req, { id });
  } catch (error: any) {
    console.error("❌ GET /api/users/[id] error:", error);
    return errorResponse("Erreur serveur", 500);
  }
}

// PUT - Modifier un utilisateur
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(req);
    
    if (authResult.response) {
      return authResult.response;
    }

    const { user } = authResult;
    return UserController.update(user, req, { id });
  } catch (error: any) {
    console.error("❌ PUT /api/users/[id] error:", error);
    return errorResponse("Erreur serveur", 500);
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(req);
    
    if (authResult.response) {
      return authResult.response;
    }

    const { user } = authResult;
    return UserController.delete(user, req, { id });
  } catch (error: any) {
    console.error("❌ DELETE /api/users/[id] error:", error);
    return errorResponse("Erreur serveur", 500);
  }
}