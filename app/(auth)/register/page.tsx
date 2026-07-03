import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/shared/Logo";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950">
      
      {/* ─── PARTIE GAUCHE : VISUEL & AVANTAGES (Visible uniquement sur grand écran) ─── */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-10 text-white bg-slate-900 overflow-hidden">
        {/* Background avec overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 z-10" />
        
        {/* Nouvelle image représentative (Collaboration, Business, Workspace moderne) */}
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
          alt="Vynex Enterprise Collaboration"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />

        {/* Logo de la marque */}
        <div className="relative z-20 flex items-center gap-2">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            width={50}
            height={50}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
          />
          <span className="text-xl font-bold text-white">Vynex</span>
        </div>

        {/* Message d'accompagnement pour l'onboarding */}
        <div className="relative z-20 mt-auto space-y-6">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed text-slate-200">
              "Rejoignez des milliers d'entreprises qui font confiance à Vynex pour piloter leur croissance, automatiser leurs rapports et centraliser leurs flux opérationnels."
            </p>
          </blockquote>
          
          {/* Liste des bénéfices de l'essai gratuit */}
          <div className="pt-6 border-t border-slate-800 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">✓</div>
              <p className="text-sm text-slate-300">Accès complet à toutes les fonctionnalités Premium</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">✓</div>
              <p className="text-sm text-slate-300">Aucune carte bancaire requise pendant 30 jours</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">✓</div>
              <p className="text-sm text-slate-300">Support client dédié 7j/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PARTIE DROITE : LE FORMULAIRE D'INSCRIPTION ─── */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-16 xl:px-24">
        
        {/* Logo mobile uniquement */}
        <div className="lg:hidden mb-8">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            width={50}
            height={50}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
          />
        </div>

        {/* Ton composant de formulaire d'inscription re-stylisé */}
        <RegisterForm />

        {/* Lien vers la connexion */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>

    </div>
  );
}