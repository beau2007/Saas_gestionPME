// validations/product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Le nom du produit est requis"),
  description: z.string().optional(),
  reference: z.string().min(1, "La référence est requise"),
  purchasePrice: z.number().min(0, "Le prix d'achat doit être positif"),
  salePrice: z.number().min(0, "Le prix de vente doit être positif"),
  taxRate: z.number().min(0).max(100).default(20),
  stockQuantity: z.number().int().min(0).default(0),
  stockMin: z.number().int().min(0).default(0),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  unit: z.string().default("unité"),
});

export const updateProductSchema = createProductSchema.partial();