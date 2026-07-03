// src/components/auth/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSent(true);
      toast.success("Email envoyé !", {
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        duration: 4000,
      });
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue, veuillez réessayer.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  /* ─── ÉTAT SOUCCÈS : EMAIL ENVOYÉ ─── */
  if (isSent) {
    return (
      <div className="w-full max-w-[400px] mx-auto text-center mt-6 bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm animate-in fade-in-50 duration-300">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900/30">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Email envoyé !
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Un lien de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception (et vos spams).
        </p>
        
        <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2">
          <Button
            onClick={() => setIsSent(false)}
            variant="outline"
            className="w-full h-10 text-slate-700 dark:text-slate-300 rounded-lg"
          >
            Renvoyer l'email
          </Button>
          
          <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  /* ─── ÉTAT INITIAL : LE FORMULAIRE ─── */
  return (
    <div className="w-full max-w-[400px] mx-auto mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm animate-in fade-in-50 duration-300">
                {/* Bloc Titres */}
        <div className="w-full max-w-[400px] mx-auto space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Pas d'inquiétude. Entrez votre adresse email ci-dessous pour recevoir instantanément un lien sécurisé de réinitialisation.
          </p>
        </div>
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Adresse email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            className="h-11 rounded-lg border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Bouton Soumission */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-500/10 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Envoi en cours...</span>
            </div>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </Button>
      </form>
    </div>
  );
}