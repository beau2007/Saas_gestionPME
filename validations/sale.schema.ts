// validations/sale.schema.ts
import { z } from "zod";

export const createSaleSchema = z.object({
  clientId: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().min(0),
      discountAmount: z.number().min(0).default(0),
    })
  ).min(1, "Au moins un article est requis"),
  paymentMethod: z.enum(["cash", "card", "transfer", "check", "mobile_payment"]),
  notes: z.string().optional(),
});

export const updateSaleSchema = z.object({
  status: z.enum(["draft", "completed", "canceled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "partial", "refunded"]).optional(),
  notes: z.string().optional(),
});