// components/invoices/InvoiceStatusBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig = {
  draft: {
    label: "Brouillon",
    color: "bg-gray-100 text-gray-700",
    icon: "✏️",
  },
  sent: {
    label: "Envoyée",
    color: "bg-blue-100 text-blue-700",
    icon: "📨",
  },
  paid: {
    label: "Payée",
    color: "bg-green-100 text-green-700",
    icon: "✅",
  },
  overdue: {
    label: "En retard",
    color: "bg-red-100 text-red-700",
    icon: "⚠️",
  },
  canceled: {
    label: "Annulée",
    color: "bg-gray-100 text-gray-500",
    icon: "❌",
  },
};

interface InvoiceStatusBadgeProps {
  status: keyof typeof statusConfig;
}

export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge className={`${config.color} gap-1.5 px-3 py-1`}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
}