// src/components/landing/Hero.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, ShieldCheck, Zap, ArrowUpRight, Kanban, CreditCard, Users2 } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28">
      {/* ─── EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN (GLOW) ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none select-none opacity-20 dark:opacity-30 mix-blend-screen z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600 to-purple-600 blur-[130px] rounded-full" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-500 to-blue-500 blur-[150px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          
          {/* ─── CONTENU GAUCHE : TEXTES ET APPELS À L'ACTION (6 Colonnes) ─── */}
          <div className="space-y-8 lg:col-span-6 text-left animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Badge de nouveauté */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-blue-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              <span>Nouveau : Version 2.0 disponible</span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl !leading-[1.15]">
              Pilotez votre entreprise 
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                simplement, partout.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base text-slate-400 sm:text-lg max-w-xl leading-relaxed">
              Gestion de stock en temps réel, facturation automatisée et suivi client. La solution SaaS tout-en-un taillée pour la croissance des PME, commerces et restaurants.
            </p>

            {/* Boutons d'action principaux */}
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-6 bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all rounded-xl">
                  Essai gratuit 30 jours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-6 border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl backdrop-blur-sm">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Regarder la démo
                </Button>
              </Link>
            </div>

            {/* Preuve Sociale (Vrais avatars) */}
            <div className="flex items-center gap-5 pt-4 border-t border-slate-900">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                ].map((url, i) => (
                  <div key={i} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-950 shadow-md">
                    <Image src={url} alt="Utilisateur Vynex" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-white">4.9/5</span>
                </div>
                <p className="text-xs text-slate-400">
                  Propulse déjà plus de <span className="font-semibold text-slate-200">1 200+ PME</span> actives.
                </p>
              </div>
            </div>

            {/* Badges de confiance discrets */}
            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-500 pt-2">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Sécurité Bancaire</div>
              <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Activation instantanée</div>
            </div>
          </div>

          {/* ─── CONTENU DROIT : LE MAQUETTAGE TABLEAU DE BORD MODERNISÉ (6 Colonnes) ─── */}
          <div className="relative lg:col-span-6 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-5 duration-1000 delay-150">
            <div className="relative w-full max-w-[560px]">
              
              {/* Ombre portée / Halo lumineux sous le dashboard */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-80" />
              
              {/* Fenêtre principale de l'application */}
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="w-full space-y-4 rounded-xl bg-slate-950/80 p-5 border border-slate-800/50">
                  
                  {/* Top Bar de la maquette */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">V</div>
                      <div className="space-y-1">
                        <div className="h-3 w-20 rounded-md bg-slate-800" />
                        <div className="h-2 w-12 rounded-sm bg-slate-900" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">🔔</div>
                      <div className="h-6 w-6 rounded-full bg-slate-800" />
                    </div>
                  </div>

                  {/* Ligne de Statistiques Clés */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
                      <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-500">Chiffre d'affaires</span><ArrowUpRight className="h-3 w-3 text-emerald-400" /></div>
                      <div className="mt-1 text-sm font-bold text-slate-200">14,280 €</div>
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
                      <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-500">Factures</span><CreditCard className="h-3 w-3 text-blue-400" /></div>
                      <div className="mt-1 text-sm font-bold text-slate-200">48 payées</div>
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
                      <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-500">Nouveaux clients</span><Users2 className="h-3 w-3 text-purple-400" /></div>
                      <div className="mt-1 text-sm font-bold text-slate-200">+12%</div>
                    </div>
                  </div>

                  {/* Graphique de Performance Modifié */}
                  <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-3 w-24 rounded bg-slate-800" />
                      <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">+24% vs mois dernier</span>
                    </div>
                    <div className="flex h-24 items-end gap-2.5 pt-2">
                      {[35, 55, 45, 75, 60, 90, 100].map((height, i) => (
                        <div key={i} className="group relative flex-1 h-full flex flex-col justify-end">
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-all duration-300"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Liste d'activités récentes (Ex: Ventes en direct) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/40 p-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs">📦</div>
                        <div>
                          <div className="h-2.5 w-24 rounded bg-slate-200" />
                          <div className="mt-1 h-2 w-16 rounded bg-slate-800" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">+189.00 €</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/40 p-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs">💼</div>
                        <div>
                          <div className="h-2.5 w-32 rounded bg-slate-200" />
                          <div className="mt-1 h-2 w-20 rounded bg-slate-800" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">+1,250.00 €</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* ─── BADGES FLOTTANTS EN ABSOLUTE ─── */}
              {/* Badge supérieur droit : Alerte de Stock */}
              <div className="absolute -right-4 -top-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-xl backdrop-blur-md animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 text-xs">⚠️</div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Alerte Stock</p>
                    <p className="text-xs font-bold text-white">Articles bas (2)</p>
                  </div>
                </div>
              </div>

              {/* Badge inférieur gauche : Gestion Multi-Boutiques */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Kanban className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">Mode Multi-boutiques</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.2 rounded">Actif</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}