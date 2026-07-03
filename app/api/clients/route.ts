// app/api/clients/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { ClientController } from "@/controllers/ClientController";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ClientController.index(user, req);
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ClientController.create(user, req);
}