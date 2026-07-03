import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/shared/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 dynamic-bg">
      
      {/* ─── PARTIE GAUCHE : IMAGE & ENTRÉPRISE (Visible uniquement sur grand écran) ─── */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-10 text-white bg-slate-900 overflow-hidden">
        {/* Background avec overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 z-10" />
        
        {/* Image représentative (Entreprise / Analytics / Bureau moderne) */}
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
          alt="Vynex Business Infrastructure"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity"
        />

        {/* Header de la partie gauche */}
        <div className="relative z-20 flex items-center gap-2">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold tracking-tight">Vynex</h1>
        </div>

        {/* Footer/Citation de la partie gauche */}
        <div className="relative z-20 mt-auto space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed text-slate-200">
              "Vynex a complètement transformé la gestion opérationnelle de nos équipes. Centraliser nos données sur une seule plateforme nous fait gagner un temps précieux au quotidien."
            </p>
            <footer className="text-sm font-semibold text-blue-400">
              Sarah Laroche — Directrice des Opérations
            </footer>
          </blockquote>
          
          {/* Petites statistiques de confiance */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">+140%</p>
              <p className="text-xs text-slate-400">de productivité globale</p>
            </div>
            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-slate-400">de disponibilité de service</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PARTIE DROITE : LE FORMULAIRE DE CONNEXION ─── */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24 bg-white dark:bg-slate-950">
        
        {/* Logo mobile uniquement (caché sur grand écran car déjà à gauche) */}
        <div className="lg:hidden mb-8">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Vynex Logo"
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
            width={50}
            height={50}
          />
        </div>

        {/* Ton composant de formulaire */}
        <LoginForm />

        {/* Footer du formulaire */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Nouveau sur la plateforme ?{" "}
          <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Créer un compte entreprise
          </a>
        </p>
      </div>

    </div>
  );
}