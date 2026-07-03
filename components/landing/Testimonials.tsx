// src/components/landing/Testimonials.tsx
"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marc Dupont",
    role: "Gérant, Pizza Roma",
    content: "Depuis que j'utilise Vynex, j'ai gagné 3 heures par jour ! La gestion de stock est devenue un jeu d'enfant. Mes employés adorent l'interface intuitive.",
    rating: 5,
    image: "MD",
    gradient: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/10",
  },
  {
    name: "Sophie Martin",
    role: "Propriétaire, Boulangerie Doré",
    content: "Les factures automatiques nous ont changé la vie. Plus d'erreurs, plus de temps perdu au quotidien. Et le support client est exceptionnel !",
    rating: 5,
    image: "SM",
    gradient: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/10",
  },
  {
    name: "Pierre Durand",
    role: "Gérant, Coiffure Style",
    content: "Mes équipes adorent la simplicité d'utilisation de la plateforme. La gestion des rendez-vous et des encaissements est fluide. Je recommande à 100%.",
    rating: 5,
    image: "PD",
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/10",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      
      {/* Halo de fond atmosphérique */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[250px] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── EN-TÊTE DE SECTION ─── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Témoignages
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Validé par nos clients.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Rejoignez plus de 500 entreprises qui ont déjà propulsé et simplifié leur gestion avec Vynex.
          </p>
        </div>

        {/* ─── GRILLE DES TÉMOIGNAGES ─── */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/20 p-8 transition-all duration-300 hover:bg-slate-900/40 hover:border-slate-800 shadow-xl hover:-translate-y-1"
            >
              {/* Icône Guillemet décorative en arrière-plan */}
              <div className="absolute top-6 right-8 text-slate-900 group-hover:text-slate-800/60 transition-colors duration-300 pointer-events-none">
                <Quote className="h-10 w-10 stroke-[1.5]" />
              </div>

              <div>
                {/* Étoiles de notation (Amber chaud avec léger Glow) */}
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.2)]"
                          : "text-slate-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Corps du message */}
                <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                  “{testimonial.content}”
                </p>
              </div>

              {/* Bloc Auteur (Avatar + Métadonnées) */}
              <div className="mt-8 flex items-center gap-3.5 border-t border-slate-950/60 pt-5">
                {/* Avatar avec initiales et dégradé premium spécifique */}
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${testimonial.gradient.split(' ')[0]} ${testimonial.gradient.split(' ')[1]} ${testimonial.gradient.split(' ')[2]} border ${testimonial.gradient.split(' ')[3]} font-bold text-xs tracking-wider shadow-inner`}>
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-100 group-hover:text-white transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}