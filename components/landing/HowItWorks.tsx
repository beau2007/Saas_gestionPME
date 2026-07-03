// src/components/landing/HowItWorks.tsx
"use client";

import { UserPlus, Settings, Rocket, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: UserPlus,
    title: "Inscription",
    description: "Créez votre compte gratuitement en moins de 30 secondes.",
    details: ["Email professionnel", "Mot de passe sécurisé", "Nom de votre entreprise"],
    color: "from-blue-500 to-cyan-500 text-blue-400 border-blue-500/20 bg-blue-500/10",
    shadow: "shadow-blue-500/[0.03]",
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Paramétrez votre espace et ajoutez vos produits.",
    details: ["Produits et tarifs", "Import clients (CSV/Excel)", "Préférences de facturation"],
    color: "from-purple-500 to-pink-500 text-purple-400 border-purple-500/20 bg-purple-500/10",
    shadow: "shadow-purple-500/[0.03]",
  },
  {
    icon: Rocket,
    title: "Lancement",
    description: "Commencez à vendre et gérez tout depuis une interface unique.",
    details: ["Ventes en 1 clic", "Factures automatiques", "Suivi des stocks en direct"],
    color: "from-amber-500 to-orange-500 text-amber-400 border-amber-500/20 bg-amber-500/10",
    shadow: "shadow-amber-500/[0.03]",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── EN-TÊTE DE SECTION ─── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Prise en Main
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Commencez en 3 étapes simples.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Rejoignez les entrepreneurs qui ont automatisé leur quotidien en quelques minutes seulement.
          </p>
        </div>

        {/* ─── GRILLE DES ÉTAPES ─── */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                
                {/* Numéro de l'étape flottant à gauche */}
                <div className="absolute -top-5 left-6 z-20">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${step.color.split(' ')[0]} ${step.color.split(' ')[1]} text-white font-extrabold text-sm shadow-lg`}>
                    0{index + 1}
                  </div>
                </div>

                {/* Boîtier principal en Glassmorphism */}
                <div className={`h-full rounded-2xl border border-slate-900 bg-slate-900/20 p-8 pt-10 text-center transition-all duration-300 hover:bg-slate-900/40 hover:border-slate-800 shadow-xl ${step.shadow} hover:-translate-y-1 flex flex-col`}>
                  
                  {/* Conteneur d'icône avec dégradé subtil */}
                  <div className="flex justify-center mt-2">
                    <div className={`rounded-xl border ${step.color.split(' ')[3]} ${step.color.split(' ')[4]} p-3`}>
                      <Icon className={`h-6 w-6 ${step.color.split(' ')[2]}`} />
                    </div>
                  </div>

                  {/* Titre & Description */}
                  <h3 className="mt-5 text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-400 leading-relaxed flex-grow">
                    {step.description}
                  </p>

                  {/* Liste des détails techniques du workflow */}
                  <ul className="mt-6 space-y-2.5 border-t border-slate-900/60 pt-5 text-left">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flèche de liaison horizontale (uniquement sur Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-30 translate-x-1/2 pointer-events-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-slate-950 text-slate-700 shadow-md">
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── APPEL À L'ACTION FINAL (CTA) ─── */}
        <div className="mt-16 text-center animate-in fade-in duration-700 delay-300">
          <Button 
            size="lg" 
            className="h-12 px-8 bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/10 transition-all rounded-xl"
          >
            Créer mon espace maintenant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-xs text-slate-500 font-medium">
            Aucun engagement • Essai complet sans carte bancaire
          </p>
        </div>

      </div>
    </section>
  );
}