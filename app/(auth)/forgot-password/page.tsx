import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Logo from "@/components/shared/Logo";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950">
      
      {/* ─── PARTIE GAUCHE : SÉCURITÉ & INFRASTRUCTURE (Visible uniquement sur grand écran) ─── */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-10 text-white bg-slate-900 overflow-hidden">
        {/* Background avec overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 z-10" />
        
        {/* Image représentative (Sécurité, Données cryptées, Tech moderne) */}
        <Image
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80" 
          alt="Vynex Secure Infrastructure"
          fill
          priority
          className="object-cover object-center opacity-25 mix-blend-luminosity"
        />

        {/* Logo de la marque Vynex */}
        <div className="relative z-20 flex items-center gap-2">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            width={50}
            height={50}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
          />
          <span className="text-3xl font-bold text-white">Vynex</span>
        </div>

        {/* Message axé sur la sécurité des données */}
        <div className="relative z-20 mt-auto space-y-6">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed text-slate-200">
              "La sécurité de vos données d'entreprise est notre priorité absolue. Nous utilisons les standards de chiffrement les plus stricts du marché pour protéger votre espace de travail."
            </p>
          </blockquote>
          
          {/* Garanties de sécurité */}
          <div className="pt-6 border-t border-slate-800 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold">✓</div>
              <p className="text-sm text-slate-300">Double authentification (2FA) disponible</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold">✓</div>
              <p className="text-sm text-slate-300">Chiffrement de bout en bout des flux de données</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PARTIE DROITE : FORMULAIRE DE RÉCUPÉRATION ─── */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24 bg-white dark:bg-slate-950">
        
        {/* Logo affiché uniquement sur mobile */}
        <div className="lg:hidden mb-8">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            width={50}
            height={50}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
          />
        </div>

        {/* Ton composant de formulaire ré-stylisé */}
        <ForgotPasswordForm />

        {/* Lien de retour au login */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>

    </div>
  );
}