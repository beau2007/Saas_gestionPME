// src/components/landing/Pricing.tsx
"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    description: "Pour valider votre idée et démarrer sereinement.",
    features: [
      { included: true, text: "1 employé" },
      { included: true, text: "50 produits référencés" },
      { included: true, text: "10 ventes par mois" },
      { included: true, text: "Support communautaire" },
      { included: false, text: "Facturation avancée & certifiée" },
      { included: false, text: "Rapports & analyses sur-mesure" },
      { included: false, text: "Accès API Développeur" },
    ],
    cta: "Démarrer gratuitement",
    popular: false,
  },
  {
    name: "Standard",
    price: "29",
    description: "Le choix idéal pour les structures en pleine croissance.",
    features: [
      { included: true, text: "5 employés inclus" },
      { included: true, text: "500 produits référencés" },
      { included: true, text: "Volume de ventes illimité" },
      { included: true, text: "Support client prioritaire" },
      { included: true, text: "Facturation avancée & certifiée" },
      { included: true, text: "Rapports & analyses sur-mesure" },
      { included: false, text: "Accès API Développeur" },
    ],
    cta: "Choisir le plan Standard",
    popular: true,
  },
  {
    name: "Premium",
    price: "59",
    description: "Une puissance maximale pour les grandes entreprises.",
    features: [
      { included: true, text: "20 employés inclus" },
      { included: true, text: "Produits référencés illimités" },
      { included: true, text: "Volume de ventes illimité" },
      { included: true, text: "Support dédié 24h/7j" },
      { included: true, text: "Facturation avancée & certifiée" },
      { included: true, text: "Rapports & analyses sur-mesure" },
      { included: true, text: "Accès API Développeur" },
    ],
    cta: "Passer au plan Premium",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── EN-TÊTE DE SECTION ─── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            Grille Tarifaire
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Des tarifs transparents, adaptés à votre taille.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Choisissez le plan taillé pour vos besoins actuels et faites-le évoluer au rythme de votre croissance.
          </p>
        </div>

        {/* ─── GRILLE DES PLANS ─── */}
        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-slate-900/80 border-2 border-blue-500 shadow-2xl shadow-blue-500/[0.05]"
                  : "bg-slate-900/20 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40"
              }`}
            >
              {/* Effet Neon / Glow uniquement derrière la carte Populaire */}
              {plan.popular && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-10 -z-10" />
              )}

              {/* Badge Populaire */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                    Le plus populaire
                  </span>
                </div>
              )}

              {/* En-tête de la carte */}
              <div className="text-center border-b border-slate-900 pb-6">
                <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center text-white">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-2xl font-semibold ml-1">€</span>
                  <span className="ml-1.5 text-sm font-medium text-slate-500">/mois</span>
                </div>
                <p className="mt-3 text-xs text-slate-400 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Liste des fonctionnalités */}
              <ul className="mt-7 space-y-3.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                        <Check className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-700">
                        <X className="h-3 w-3" />
                      </div>
                    )}
                    <span className={feature.included ? "text-slate-300 font-medium" : "text-slate-600 line-through decoration-slate-800"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Bouton d'action CTA */}
              <div className="mt-8">
                <Button
                  className={`w-full h-11 font-semibold rounded-xl transition-all shadow-sm ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50"
                  }`}
                >
                  {plan.cta}
                </Button>
                {plan.price === "0" && (
                  <p className="mt-2.5 text-center text-[11px] text-slate-500 font-medium">
                    Aucune carte bancaire requise.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── FOOTER DES TARIFS ─── */}
        <div className="mt-16 text-center space-y-2 max-w-xl mx-auto">
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            * Tous les plans sont <span className="text-slate-400 font-semibold">sans engagement</span> et ajustables à la hausse comme à la baisse en un clic depuis vos paramètres d'entreprise.
          </p>
          <p className="text-sm text-slate-400 pt-2">
            Besoin d'une infrastructure sur-mesure (plus de 50 comptes employés) ?{" "}
            <a href="#contact" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-500/30 underline-offset-4">
              Contactez notre équipe
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}