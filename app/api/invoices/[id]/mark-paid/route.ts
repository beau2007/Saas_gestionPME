// app/api/invoices/[id]/mark-paid/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { InvoiceController } from "@/controllers/InvoiceController";

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
  return InvoiceController.markAsPaid(user, req, { id });
}