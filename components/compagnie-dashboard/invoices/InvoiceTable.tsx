// components/invoices/InvoicesTable.tsx
"use client";

import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  invoiceDate: string;
  dueDate: string;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onSend: (id: string) => void;
  onDownloadPDF: (id: string) => void;
}

export default function InvoicesTable({
  invoices,
  isLoading,
  pagination,
  onPageChange,
  onDelete,
  onMarkPaid,
  onSend,
  onDownloadPDF,
}: InvoicesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Chargement des factures...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 shadow-sm">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Aucune facture trouvée
        </h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Ajustez vos filtres ou créez une nouvelle facture pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
      {/* Table Wrapper pour le scroll horizontal propre */}
      <div className="overflow-x-auto combined-scroll">
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 backdrop-blur-sm">
              <th className="px-6 py-4 font-semibold">Facture</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Montant</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Échéance</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="relative px-6 py-4 text-right font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {invoices.map((invoice) => {
              const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== "paid" && invoice.status !== "canceled";
              
              return (
                <tr 
                  key={invoice.id} 
                  className="group transition-colors duration-150 hover:bg-slate-50/60"
                >
                  {/* Numéro Facture */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50/80 border border-blue-100 text-blue-600 transition-colors group-hover:bg-blue-100/70">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="px-6 py-4">
                    {invoice.client ? (
                      <div className="max-w-[200px] truncate">
                        <p className="font-medium text-slate-900 truncate">
                          {invoice.client.firstName} {invoice.client.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate group-hover:text-slate-500 transition-colors">
                          {invoice.client.email}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-100">
                        Client inconnu
                      </span>
                    )}
                  </td>

                  {/* Montant */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(invoice.total)}
                    </span>
                  </td>

                  {/* Date d'émission */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {formatDate(invoice.invoiceDate)}
                  </td>

                  {/* Date d'échéance */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium ${
                        isOverdue
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "text-slate-500"
                      }`}
                    >
                      {formatDate(invoice.dueDate)}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <InvoiceActions
                      invoiceId={invoice.id}
                      status={invoice.status}
                      onDelete={onDelete}
                      onMarkPaid={onMarkPaid}
                      onSend={onSend}
                      onDownloadPDF={onDownloadPDF}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Style Moderne */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
          <p className="text-xs font-medium text-slate-500">
            Affichage de <span className="font-semibold text-slate-700">{invoices.length}</span> sur{" "}
            <span className="font-semibold text-slate-700">{pagination.total}</span> facture(s)
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500">
              Page {pagination.page} sur {pagination.totalPages}
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Précédent</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Suivant</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}