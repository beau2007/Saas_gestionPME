// app/api/products/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { ProductController } from "@/controllers/ProductController";

// GET - Détail d'un produit
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ProductController.show(user, req, { id });
}

// PUT - Modifier un produit
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ProductController.update(user, req, { id });
}

// DELETE - Supprimer un produit
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ProductController.delete(user, req, { id });
}