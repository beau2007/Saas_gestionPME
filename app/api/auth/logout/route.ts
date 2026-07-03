// src/app/api/auth/logout/route.ts
import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/AuthController";

export async function POST(req: NextRequest) {
  return AuthController.logout(req);
}