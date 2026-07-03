// src/components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Schéma de validation
const registerSchema = z
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");
  const acceptTerms = watch("acceptTerms");

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      // Appel à l'API d'inscription
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: data.companyName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'inscription");
      }

      // ✅ Inscription réussie
      toast.success("Compte créé avec succès !", {
        description: "Un email de confirmation vous a été envoyé.",
        duration: 4000,
      });

      // Stocker le token si l'API le renvoie (optionnel)
      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("refreshToken", result.data.refreshToken);
      }

      // Rediriger vers le dashboard ou la page de vérification email
      router.push("/login");
    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description: error.message || "Une erreur est survenue, veuillez réessayer.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[480px] mx-auto mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
        
        {/* Titre */}
        <div className="w-full max-w-[480px] mx-auto space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Créer un compte
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Commencez votre essai gratuit de 30 jours
          </p>
        </div>

        {/* Nom de l'entreprise */}
        <div className="space-y-1.5">
          <label htmlFor="companyName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Nom de l'entreprise <span className="text-blue-500">*</span>
          </label>
          <Input
            id="companyName"
            placeholder="Ma Super Entreprise"
            className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Grille : Prénom et Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Prénom <span className="text-blue-500">*</span>
            </label>
            <Input
              id="firstName"
              placeholder="Jean"
              className="h-11 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Nom <span className="text-blue-500">*</span>
            </label>
            <Input
              id="lastName"
              placeholder="Dupont"
              className="h-11 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Grille : Email et Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email <span className="text-blue-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              className="h-11 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Téléphone
            </label>
            <Input
              id="phone"
              placeholder="+33 6 12 34 56 78"
              className="h-11 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mot de passe <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 pr-10 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Critères de mot de passe */}
          <div className="mt-2 grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Check className={`h-3 w-3 shrink-0 transition-colors ${password?.length >= 8 ? "text-green-500" : "text-slate-300 dark:text-slate-700"}`} />
              <span>8+ caractères</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Check className={`h-3 w-3 shrink-0 transition-colors ${/[A-Z]/.test(password || "") ? "text-green-500" : "text-slate-300 dark:text-slate-700"}`} />
              <span>1 Majuscule</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Check className={`h-3 w-3 shrink-0 transition-colors ${/[0-9]/.test(password || "") ? "text-green-500" : "text-slate-300 dark:text-slate-700"}`} />
              <span>1 Chiffre</span>
            </div>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmer le mot de passe */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirmer le mot de passe <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 pr-10 rounded-lg border-slate-200 dark:border-slate-800"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Conditions d'utilisation */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-sm font-normal leading-tight text-slate-600 dark:text-slate-400 select-none cursor-pointer">
              J'accepte les{" "}
              <a href="/terms" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="/privacy" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                politique de confidentialité
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-500/10 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Création du compte...</span>
            </div>
          ) : (
            "Créer mon compte gratuitement"
          )}
        </Button>

        {/* Note RGPD */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 px-4 leading-normal">
          En créant un compte, vous acceptez de recevoir des communications de Vynex. Vous pouvez vous désinscrire à tout moment.
        </p>
      </form>
    </div>
  );
}