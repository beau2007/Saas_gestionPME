// components/reports/ReportTable.tsx
"use client";

import { useState } from "react";
import { Search, Loader2, ChevronDown, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: string;
  reference: string;
  clientName: string;
  total: number;
  status: string;
  paymentMethod: string;
  saleDate: string;
}

interface ReportTableProps {
  sales: Sale[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  period: string;
}

export default function ReportTable({
  sales,
  pagination,
  onPageChange,
  period,
}: ReportTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSales = sales.filter((sale) =>
    sale.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusLabels: Record<string, { label: string; color: string }> = {
    completed: { label: "Complétée", color: "bg-green-100 text-green-700" },
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
    canceled: { label: "Annulée", color: "bg-red-100 text-red-700" },
    draft: { label: "Brouillon", color: "bg-gray-100 text-gray-700" },
  };

  const paymentLabels: Record<string, string> = {
    cash: "Espèces",
    card: "Carte bancaire",
    transfer: "Virement",
    check: "Chèque",
    mobile_payment: "Paiement mobile",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* En-tête */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Détail des ventes</h3>
          <p className="text-xs text-gray-500">
            {pagination.total} vente(s) sur la période
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        {filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">Aucune vente trouvée</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Référence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Montant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Paiement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => {
                const status = statusLabels[sale.status] || statusLabels.draft;
                return (
                  <tr key={sale.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">
                      {sale.reference}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {sale.clientName}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {paymentLabels[sale.paymentMethod] || sale.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(sale.saleDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-500">
            {pagination.total} vente(s)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Précédent
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-700">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}