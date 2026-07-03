// components/employees/EmployeeStats.tsx
"use client";

import { Users, UserCheck, Clock, UserX } from "lucide-react";

interface EmployeeStatsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
}

export default function EmployeeStats({ stats }: EmployeeStatsProps) {
  const items = [
    {
      label: "Total",
      value: stats.total,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Actifs",
      value: stats.active,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Inactifs",
      value: stats.inactive,
      icon: UserX,
      color: "bg-gray-50 text-gray-600",
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