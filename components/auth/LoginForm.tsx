// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const remember = watch("remember");

async function onSubmit(data: LoginFormValues) {
  setIsLoading(true);
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur de connexion");
    }

    toast.success("Connexion réussie !", {
      description: "Redirection vers votre tableau de bord...",
      duration: 3000,
    });

    if (result.data?.token) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      document.cookie = `token=${result.data.token}; path=/; max-age=604800`;

      // ✅ SOLUTION : Fusionner user et company dans un seul objet
      if (result.data.user) {
        const userWithCompany = {
          ...result.data.user,
          company: result.data.company || null, // ← La clé magic
        };
        localStorage.setItem("user", JSON.stringify(userWithCompany));
        console.log("✅ Utilisateur stocké avec company:", userWithCompany);
      }
    }

    window.location.href = "/dashboard-user";
  } catch (error: any) {
    toast.error("Erreur de connexion", {
      description: error.message || "Email ou mot de passe incorrect",
      duration: 4000,
    });
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="w-full max-w-[420px] mx-auto mt-8">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-5 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
      >
        <div className="space-y-2 content-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-white">CONNEXION</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Entrez vos identifiants pour accéder à votre espace entreprise.
          </p>
        </div>
        
        {/* Champ Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mot de passe
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 pr-10 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Options : Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setValue("remember", checked === true)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer select-none"
            >
              Se souvenir de moi
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-500/10 transition-colors mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connexion en cours...</span>
            </div>
          ) : (
            "Se connecter"
          )}
        </Button>

        {/* Lien vers l'inscription */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}