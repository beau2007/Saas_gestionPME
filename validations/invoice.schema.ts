// validations/invoice.schema.ts
import { z } from "zod";

export const createInvoiceSchema = z.object({
  clientId: z.string(),
  saleId: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
  footerText: z.string().optional(),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["draft", "sent", "paid", "overdue", "canceled"]).optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  notes: z.string().optional(),
});