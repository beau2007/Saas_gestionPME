// src/components/landing/FAQ.tsx
"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Comment puis-je commencer à utiliser Vynex ?",
    answer: "Créez simplement votre compte d'entreprise en moins de 30 secondes, configurez votre espace de travail en important vos produits (via Excel/CSV) ou vos clients, et lancez vos premières ventes. Aucune carte bancaire n'est requise pour démarrer votre essai gratuit.",
  },
  {
    question: "Mon entreprise est-elle éligible à la plateforme ?",
    answer: "Vynex a été pensé pour s'adapter à la flexibilité des petites et moyennes structures : commerces de détail, boutiques en ligne, restaurants, artisans, prestataires de services et freelances. Nos modules s'adaptent à vos obligations comptables et à la nature de vos inventaires.",
  },
  {
    question: "Puis-je essayer Vynex avant de m'engager ?",
    answer: "Absolument. Nous mettons un point d'honneur à ce que vous validiez l'outil en situation réelle. Tous nos plans intègrent une période d'essai de 30 jours, sans aucune restriction de fonctionnalités. Vous restez libre de suspendre votre accès à tout moment.",
  },
  {
    question: "Comment mes données d'entreprise sont-elles sécurisées ?",
    answer: "La sécurité est au cœur de notre infrastructure. Vos données de ventes, de stocks et vos fiches clients bénéficient d'un chiffrement de bout en bout (AES-256), d'un hébergement européen hautement sécurisé avec réplication en temps réel et d'une conformité stricte au RGPD.",
  },
  {
    question: "Est-il possible d'inviter des collaborateurs sur mon espace ?",
    answer: "Oui, selon le plan d'abonnement choisi, vous disposez d'un quota de comptes employés. Chaque collaborateur dispose de ses propres identifiants, et vous pouvez définir précisément ses rôles (caissier, gestionnaire de stock, comptable) et ses droits de lecture ou d'écriture.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés pour l'abonnement ?",
    answer: "Nous acceptons la majorité des cartes de paiement courantes (Visa, Mastercard, American Express) via notre passerelle sécurisée. Pour les entreprises choisissant une facturation annuelle, nous mettons également à disposition le paiement par virement bancaire SEPA.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      
      {/* Halo lumineux diffus en arrière-plan */}
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-blue-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── EN-TÊTE DE SECTION ─── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Aide & Support
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Questions fréquentes.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tout ce que vous devez savoir sur notre plateforme avant de propulser votre activité.
          </p>
        </div>

        {/* ─── ACCORDÉONS DE LA FAQ ─── */}
        <div className="mx-auto mt-16 max-w-3xl space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-slate-800 bg-slate-900/40 shadow-xl shadow-blue-500/[0.01]"
                    : "border-slate-900 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/20"
                }`}
              >
                {/* Déclencheur / Bouton Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left group"
                >
                  <span className={`font-semibold text-base transition-colors duration-200 ${
                    isOpen ? "text-blue-400" : "text-slate-200 group-hover:text-white"
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Indicateur de rotation chevron */}
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                    isOpen 
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400 rotate-180" 
                      : "border-slate-800 bg-slate-950 text-slate-500 group-hover:text-slate-300 group-hover:border-slate-700"
                  }`}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {/* Zone de réponse animée en hauteur/opacité native CSS */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100 border-t border-slate-900/60" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pt-4 pb-5">
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── FOOTER DISCRET DE LA FAQ ─── */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-900 bg-slate-900/20 px-5 py-3 text-sm text-slate-400 max-w-md mx-auto">
            <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
            <span>
              Une question spécifique ?{" "}
              <a href="#contact" className="font-semibold text-white hover:text-blue-400 transition-colors underline underline-offset-4 decoration-slate-800 hover:decoration-blue-400/40">
                Discutez avec notre support
              </a>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}