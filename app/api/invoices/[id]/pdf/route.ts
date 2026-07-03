// app/api/invoices/[id]/pdf/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { InvoiceController } from "@/controllers/InvoiceController";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← ✅ Ajouter Promise<>
) {
  // ✅ Déstructurer avec await
  const { id } = await params;
  
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  
  // ✅ Passer l'id extrait
  return InvoiceController.generatePDF(user, req, { id });
}