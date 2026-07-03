import { LayoutDashboard } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Conteneur de l'icône avec un effet de dégradé et d'ombre dynamique */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
        
        {/* Effet de reflet de lumière subtil au survol */}
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* L'icône Lucide */}
        <LayoutDashboard className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-3" />
      </div>

      {/* Nom de la marque (Vynex) */}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
          Vynex
        </span>
        <span className="text-[10px] font-medium tracking-widest uppercase text-slate-400 dark:text-slate-500 -mt-1">
          Dashboard
        </span>
      </div>
    </div>
  );
}