// app/api/invoices/route.ts
import { NextRequest } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { InvoiceController } from "@/controllers/InvoiceController";

// GET - Liste des factures
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return InvoiceController.index(user, req);
}

// POST - Créer une facture
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.response) {
    return authResult.response;
  }

  const { user } = authResult;
  return InvoiceController.create(user, req);
}