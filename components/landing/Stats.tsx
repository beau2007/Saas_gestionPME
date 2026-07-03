// src/components/landing/Stats.tsx
"use client";

import { Users, ShoppingBag, Star, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    icon: Users,
    value: 500,
    label: "Entreprises clientes",
    suffix: "+",
  },
  {
    icon: ShoppingBag,
    value: 50000,
    label: "Ventes traitées / mois",
    suffix: "+",
  },
  {
    icon: Star,
    value: 98,
    label: "Taux de satisfaction",
    suffix: "%",
  },
  {
    icon: TrendingUp,
    value: 4.8,
    label: "Note moyenne",
    suffix: "/5",
  },
];

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-20 bg-slate-950 border-t border-slate-900 overflow-hidden">
      {/* Léger halo lumineux de fond pour lier les sections */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[200px] bg-blue-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-4 md:divide-x md:divide-slate-900"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group flex flex-col items-center text-center px-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Conteneur d'icône futuriste */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:border-slate-700 transition-all duration-300 shadow-inner">
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
                </div>

                {/* Chiffre animé en dégradé */}
                <div className="mt-5 text-4xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=" "
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                      decimal=","
                      suffix={stat.suffix}
                    />
                  ) : (
                    "0"
                  )}
                </div>

                {/* Label descriptif */}
                <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider max-w-[180px]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}