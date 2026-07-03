// app/api/reports/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { ReportController } from "@/controllers/ReportController";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return ReportController.getStats(user, req);
}