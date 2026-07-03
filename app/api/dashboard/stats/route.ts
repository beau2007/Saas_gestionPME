// app/api/dashboard/stats/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { DashboardController } from "@/controllers/DashboardController";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "month";
  
  const { user } = authResult;
  return DashboardController.getStats(user, period);
}