// src/app/dashboard-user/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

// ============================================
// TYPES
// ============================================

interface DashboardStats {
  stats: {
    totalSales: number;
    totalRevenue: number;
    totalClients: number;
    totalProducts: number;
    lowStockProducts: number;
    monthlyRevenue: number;
  };
  recentActivities: {
    sales: Array<{
      id: string;
      reference: string;
      total: number;
      status: string;
      saleDate: string;
      client: {
        firstName: string;
        lastName: string;
      } | null;
      user: {
        firstName: string;
        lastName: string;
      };
    }>;
    clients: Array<{
      id: string;
      firstName: string;
      lastName: string;
      createdAt: string;
    }>;
  };
  salesChart: {
    period: string;
    data: Array<{
      date: string;
      total: number;
      count: number;
    }>;
  };
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  // Chargement des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/dashboard/stats?period=${chartPeriod}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error("Erreur lors du chargement des données");
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          throw new Error(result.message || "Données non disponibles");
        }
      } catch (error: any) {
        console.error("Erreur dashboard:", error);
        setError(error.message || "Erreur de chargement");
        toast.error("Erreur", {
          description: "Impossible de charger les données du tableau de bord",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, chartPeriod]);

  // ============================================
  // UTILITAIRES DE FORMATAGE
  // ============================================

  // ✅ Convertir en nombre de manière sûre
  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  // ✅ Formater un montant en euros
  const formatCurrency = (amount: any): string => {
    const num = toNumber(amount);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  // ✅ Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR');
  };

  // ✅ Formater une date pour le graphique
  const formatChartDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.length === 7) {
      const [year, month] = dateStr.split('-');
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // ============================================
  // CONSTRUCTION DES DONNÉES
  // ============================================

  // Construction des KPIs
  const getKpis = () => {
    if (!stats) return [];

    const { stats: data } = stats;
    
    return [
      {
        name: "Chiffre d'Affaires (Mensuel)",
        value: formatCurrency(data.monthlyRevenue || data.totalRevenue || 0),
        change: "+12.3%",
        isPositive: true,
        icon: TrendingUp,
        color: "text-blue-600 border-blue-100 bg-blue-50/50",
      },
      {
        name: "Transactions Traitées",
        value: data.totalSales.toString(),
        change: "+8.1%",
        isPositive: true,
        icon: ShoppingBag,
        color: "text-purple-600 border-purple-100 bg-purple-50/50",
      },
      {
        name: "Clients",
        value: data.totalClients.toString(),
        change: "+5.2%",
        isPositive: true,
        icon: Users,
        color: "text-amber-600 border-amber-100 bg-amber-50/50",
      },
      {
        name: "Alertes Stock",
        value: `${data.lowStockProducts} références`,
        change: "Suivi requis",
        isPositive: false,
        isAlert: true,
        icon: Package,
        color: "text-rose-600 border-rose-100 bg-rose-50/50",
      },
    ];
  };

  // Construction des ventes récentes
  const getRecentSales = () => {
    if (!stats?.recentActivities?.sales) return [];
    
    return stats.recentActivities.sales.map((sale) => ({
      id: sale.reference || sale.id.substring(0, 8),
      client: sale.client 
        ? `${sale.client.firstName} ${sale.client.lastName}`
        : "Client inconnu",
      total: formatCurrency(sale.total),
      status: sale.status === "completed" ? "Complété" : 
              sale.status === "pending" ? "En attente" :
              sale.status === "canceled" ? "Annulé" : sale.status,
      time: formatDate(sale.saleDate),
    }));
  };

  // Construction des alertes stock
  const getStockAlerts = () => {
    if (!stats?.stats?.lowStockProducts) {
      return [
        { name: "Aucune alerte", rest: "Stock OK", status: "Tout est bon" }
      ];
    }
    
    return [
      { 
        name: `${stats.stats.lowStockProducts} produit(s) en stock faible`, 
        rest: "À réapprovisionner", 
        status: "Attention requise" 
      }
    ];
  };

  // ✅ Données du graphique avec conversion sécurisée
  const getChartData = () => {
    if (!stats?.salesChart?.data || stats.salesChart.data.length === 0) {
      return [];
    }
    
    return stats.salesChart.data.map((item) => ({
      date: item.date || '',
      total: toNumber(item.total),
      count: toNumber(item.count),
    }));
  };

  const chartData = getChartData();
  
  // ✅ Calcul du max avec conversion sécurisée
  const maxValue = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.total)) 
    : 100;

  // ============================================
  // ÉTATS DE CHARGEMENT ET D'ERREUR
  // ============================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-500">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full bg-red-100 p-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <p className="mt-4 text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const kpis = getKpis();
  const recentSales = getRecentSales();
  const stockAlerts = getStockAlerts();

  // ============================================
  // RENDU
  // ============================================

  return (
    <div className="flex flex-col min-h-screen w-full max-w-none bg-slate-50 text-slate-800 p-0 m-0 space-y-6 overflow-x-hidden">
      
      {/* ─── EN-TÊTE ─── */}
      <div className="w-full bg-white border-b border-slate-200 py-5 px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Espace de gestion
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vue d'ensemble et indicateurs de performance de votre activité en temps réel.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Compte Professionnel Actif
        </div>
      </div>

      {/* Conteneur principal */}
      <div className="w-full px-6 flex flex-col gap-6 flex-1 pb-6">

        {/* ─── GRILLE DES KPIs ─── */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shrink-0 w-full">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {kpi.name}
                  </span>
                  <div className={`rounded-xl border p-2 ${kpi.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {kpi.value}
                  </span>
                  
                  <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    kpi.isAlert 
                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                      : kpi.isPositive 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-rose-50 text-rose-700"
                  }`}>
                    {!kpi.isAlert && (kpi.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── SECTION CONTENU ─── */}
        <div className="flex-1 grid gap-6 grid-cols-1 lg:grid-cols-3 w-full items-stretch">
          
          {/* Colonne Gauche */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full w-full">
            
            {/* ✅ GRAPHIQUE DES VENTES - CORRIGÉ */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col w-full">
              {/* En-tête du graphique */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 shrink-0 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Évolution des ventes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {chartPeriod === "week" ? "7 derniers jours" :
                     chartPeriod === "month" ? "Ce mois" :
                     chartPeriod === "quarter" ? "Ce trimestre" :
                     "Cette année"}
                  </p>
                </div>
                
                {/* Sélecteur de période */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  {[
                    { value: "week", label: "Sem." },
                    { value: "month", label: "Mois" },
                    { value: "quarter", label: "Trim." },
                    { value: "year", label: "Année" },
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setChartPeriod(period.value as any)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        chartPeriod === period.value
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Légende */}
              <div className="flex items-center gap-4 text-xs mb-4">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-slate-500">Montant (€)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 bg-blue-300"></span>
                  <span className="text-slate-500">Tendance</span>
                </span>
              </div>
              
              {/* Le graphique */}
              <div className="flex-1 relative min-h-[220px] w-full">
                {/* Lignes de fond */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <div key={val} className="border-t border-slate-200 w-full"></div>
                  ))}
                </div>

                {/* Barres */}
                <div className="relative h-full flex items-end justify-between gap-2 pt-2 pb-1">
                  {chartData.length === 0 ? (
                    <div className="w-full text-center text-slate-400 text-sm py-8">
                      Aucune donnée disponible pour cette période
                    </div>
                  ) : (
                    chartData.map((item, index) => {
                      // ✅ Conversion sécurisée
                      const totalValue = toNumber(item.total);
                      const height = maxValue > 0 ? (totalValue / maxValue) * 100 : 0;
                      const isLast = index === chartData.length - 1;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group min-w-[20px]">
                          {/* ✅ Valeur avec toFixed sécurisé */}
                          <span className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {totalValue.toFixed(0)}€
                          </span>
                          
                          {/* Barre */}
                          <div 
                            className="w-full rounded-t-md transition-all duration-500 hover:scale-y-[1.02] origin-bottom relative"
                            style={{ 
                              height: `${Math.max(height, 5)}%`,
                              minHeight: '8px',
                              background: isLast 
                                ? 'linear-gradient(180deg, #2563EB, #1D4ED8)' 
                                : 'linear-gradient(180deg, #93C5FD, #60A5FA)',
                              boxShadow: isLast ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-white/20 rounded-t-md"></div>
                            {isLast && chartData.length > 1 && (
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                                <span className="text-[8px] font-bold text-blue-600 bg-white px-1.5 py-0.5 rounded shadow-sm">
                                  MAX
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Étiquette */}
                          <span className={`text-[9px] font-medium ${
                            isLast ? 'text-blue-600 font-bold' : 'text-slate-400'
                          } uppercase shrink-0`}>
                            {formatChartDate(item.date)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ✅ Statistiques en bas avec conversion sécurisée */}
              {chartData.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[10px]">
                  <div className="text-slate-500">
                    Total : <span className="font-semibold text-slate-700">
                      {chartData.reduce((sum, d) => sum + toNumber(d.total), 0).toFixed(0)}€
                    </span>
                  </div>
                  <div className="text-slate-500 text-center">
                    {chartData.length} période(s)
                  </div>
                  <div className="text-slate-500 text-right">
                    Moyenne : <span className="font-semibold text-slate-700">
                      {(chartData.reduce((sum, d) => sum + toNumber(d.total), 0) / (chartData.length || 1)).toFixed(0)}€
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tableau des transactions */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col flex-1 min-h-[280px] w-full">
              <div className="p-6 border-b border-slate-100 shrink-0 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Flux des dernières opérations</h3>
                <span className="text-xs text-slate-400">
                  {recentSales.length} transaction(s)
                </span>
              </div>
              
              {recentSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-sm text-slate-500">Aucune transaction récente</p>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-slate-150 text-slate-400 text-[11px] uppercase tracking-wider font-bold bg-slate-50/80 backdrop-blur-sm">
                        <th className="p-4 pl-6">Référence</th>
                        <th className="p-4">Tiers / Client</th>
                        <th className="p-4">Montant total</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 pr-6 text-right">Horodatage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                      {recentSales.map((sale, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs text-blue-600">{sale.id}</td>
                          <td className="p-4 text-slate-700">{sale.client}</td>
                          <td className="p-4 text-slate-900 font-semibold">{sale.total}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                              sale.status === "Complété" 
                                ? "bg-emerald-50 text-emerald-700" 
                                : sale.status === "En attente"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                              {sale.status === "Complété" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {sale.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right text-xs text-slate-400">{sale.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* Colonne Droite */}
          <div className="flex flex-col gap-6 h-full w-full">
            
            {/* Actions rapides */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col justify-center flex-1 w-full">
              <h3 className="text-sm font-bold text-slate-900 shrink-0">Actions rapides</h3>
              <div className="grid gap-2.5 w-full">
                <button 
                  onClick={() => router.push("/dashboard-user/sales/new")}
                  className="w-full text-left rounded-xl border border-slate-150 bg-white p-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5 text-slate-400" /> Nouvelle vente
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
                <button 
                  onClick={() => router.push("/dashboard-user/products/new")}
                  className="w-full text-left rounded-xl border border-slate-150 bg-white p-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5 text-slate-400" /> Ajouter un produit
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
                <button 
                  onClick={() => router.push("/dashboard-user/invoices/new")}
                  className="w-full text-left rounded-xl border border-slate-150 bg-white p-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5 text-slate-400" /> Émettre une facture
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
              </div>
            </div>

            {/* Alertes stock */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between flex-1 w-full">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-slate-900">Alertes & Suivi</h3>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              
              <div className="space-y-3 flex-1 flex flex-col justify-center w-full">
                {stockAlerts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-150 w-full">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{item.rest}</p>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${
                      item.status === "Tout est bon" 
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                        : "text-rose-700 bg-rose-50 border-rose-100"
                    } border rounded-md px-2 py-0.5`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}