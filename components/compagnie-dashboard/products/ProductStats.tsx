// components/products/ProductStats.tsx
"use client";

import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ProductStatsProps {
  stats: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
}

export default function ProductStats({ stats }: ProductStatsProps) {
  const items = [
    {
      label: "Total produits",
      value: stats.total,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Actifs",
      value: stats.active,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Stock faible",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Rupture de stock",
      value: stats.outOfStock,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className={`rounded-full ${item.color} p-2.5`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}