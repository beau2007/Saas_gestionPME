// components/invoices/InvoiceStats.tsx
"use client";

import { FileText, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface InvoiceStatsProps {
  stats: {
    total: number;
    totalAmount: number;
    statusCounts: Array<{ status: string; _count: number }>;
  };
}

export default function InvoiceStats({ stats }: InvoiceStatsProps) {
  const getCount = (status: string) => {
    const found = stats.statusCounts.find((s) => s.status === status);
    return found?._count || 0;
  };

  // Ensure totalAmount is a number
  const totalAmount = typeof stats.totalAmount === 'number' 
    ? stats.totalAmount 
    : parseFloat(String(stats.totalAmount || 0));

  const items = [
    {
      label: "Total",
      value: stats.total,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Montant total",
      value: `${totalAmount.toFixed(2)} €`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Payées",
      value: getCount("paid"),
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Envoyées",
      value: getCount("sent"),
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "En retard",
      value: getCount("overdue"),
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {item.label}
                </p>
                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  {item.value}
                </p>
              </div>
              <div className={`rounded-full ${item.color} p-2 sm:p-2.5`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}