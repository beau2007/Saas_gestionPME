// components/reports/ReportStats.tsx
"use client";

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Euro
} from "lucide-react";

interface ReportStatsProps {
  stats: {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    totalClients: number;
    totalProducts: number;
    revenueChange: number;
    salesChange: number;
  };
  chart: {
    labels: string[];
    values: number[];
  };
}

export default function ReportStats({ stats, chart }: ReportStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: Euro,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Nombre de ventes",
      value: formatNumber(stats.totalSales),
      change: stats.salesChange,
      icon: ShoppingBag,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Panier moyen",
      value: formatCurrency(stats.averageOrderValue),
      change: 0,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Clients actifs",
      value: formatNumber(stats.totalClients),
      change: 0,
      icon: Users,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const maxChartValue = Math.max(...chart.values, 1);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change > 0;

          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                  <p className="text-lg font-bold text-gray-900 sm:text-xl">
                    {kpi.value}
                  </p>
                </div>
                <div className={`rounded-full ${kpi.color} p-2`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              {kpi.change !== 0 && (
                <div
                  className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}