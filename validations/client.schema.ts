// validations/client.schema.ts
import { z } from "zod";

export const createClientSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("France"),
  companyName: z.string().optional(),
  siret: z.string().optional(),
  vatNumber: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateClientSchema = createClientSchema.partial();