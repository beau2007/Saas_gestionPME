// src/lib/validations.ts
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().default(false),
});

export const registerSchema = z
  .object({
    companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    password: z.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});
