// src/components/landing/Features.tsx
"use client";

import { 
  Package, 
  FileText, 
  Users, 
  CreditCard, 
  BarChart3, 
  Smartphone,
  ArrowRight,
  Shield,
  Clock,
  Zap,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Gestion de stock",
    description: "Suivez votre stock en temps réel. Alertes automatiques et historique complet des mouvements de marchandises.",
    color: "text-blue-400 group-hover:text-blue-300",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: FileText,
    title: "Facturation",
    description: "Générez des factures certifiées et professionnelles en un éclair. Envoi automatisé par email et relance des impayés.",
    color: "text-purple-400 group-hover:text-purple-300",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Users,
    title: "Gestion clients (CRM)",
    description: "Fiches clients centralisées, historique précis d'achat et segmentation dynamique pour fidéliser votre audience.",
    color: "text-emerald-400 group-hover:text-emerald-300",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: CreditCard,
    title: "Ventes & paiements",
    description: "Interface de caisse ultra-rapide et intuitive. Supporte le multi-paiement, les acomptes et la clôture de caisse.",
    color: "text-amber-400 group-hover:text-amber-300",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Rapports & analyses",
    description: "Tableaux de bord sur-mesure, exports comptables en un clic (Excel/PDF) et prévisions de vos marges nettes.",
    color: "text-rose-400 group-hover:text-rose-300",
    bgColor: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: Smartphone,
    title: "Multi-utilisateurs & Mobile",
    description: "Accédez à vos données sur smartphone, tablette ou PC. Gestion fine des collaborateurs avec rôles et permissions.",
    color: "text-indigo-400 group-hover:text-indigo-300",
    bgColor: "bg-indigo-500/10 border-indigo-500/20",
  },
];

const stats = [
  { icon: Shield, value: "100%", label: "Conforme RGPD & Sécurisé" },
  { icon: Clock, value: "24h/7j", label: "Support client dédié" },
  { icon: Zap, value: "30 jours", label: "Essai gratuit sans engagement" },
  { icon: CheckCircle2, value: "99.9%", label: "Disponibilité serveur (Uptime)" },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      
      {/* Micro-effet de lumière en arrière-plan sous la grille */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── EN-TÊTE DE SECTION ─── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Fonctionnalités Clés
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tout ce dont votre entreprise a besoin.
          </h2>
          <p className="text-base text-slate-400 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une infrastructure robuste et des outils taillés pour centraliser et automatiser la gestion de votre activité au quotidien.
          </p>
        </div>

        {/* ─── GRILLE DES CARACTÉRISTIQUES ─── */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-900 bg-slate-900/20 p-8 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/[0.02] hover:-translate-y-1"
              >
                {/* Icône enveloppée avec bordure colorée transparente */}
                <div className={`inline-flex rounded-xl p-3 border ${feature.bgColor} transition-colors duration-300`}>
                  <Icon className={`h-6 w-6 ${feature.color} transition-colors duration-300`} />
                </div>

                {/* Titre & Description */}
                <h3 className="mt-5 text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>

                {/* Bouton Action En savoir plus discret */}
                <div className="mt-5 flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer">
                  <span>Découvrir le module</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CHASSIS DES INDICATEURS DE CONFIANCE (STATS) ─── */}
        <div className="mt-20 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md p-6 sm:p-8 grid gap-6 grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-900">
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-center text-center px-4 ${idx > 1 ? 'pt-6 lg:pt-0' : idx > 0 ? 'pt-0 sm:pt-0' : ''} lg:pt-0`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-slate-400 mb-2">
                  <StatIcon className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
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