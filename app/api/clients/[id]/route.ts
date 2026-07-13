// app/api/clients/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { ClientController } from "@/controllers/ClientController";

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
  return ClientController.show(user, req, { id });
}

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
  return ClientController.update(user, req, { id });
}

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
  return ClientController.delete(user, req, { id });
}