// components/invoices/InvoiceFilters.tsx
"use client";

import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InvoiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onRefresh: () => void;
}

export default function InvoiceFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onRefresh,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher une facture (n°, client)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">Tous les statuts</option>
        <option value="draft">Brouillon</option>
        <option value="sent">Envoyée</option>
        <option value="paid">Payée</option>
        <option value="overdue">En retard</option>
        <option value="canceled">Annulée</option>
      </select>

      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">Toutes les dates</option>
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
        <option value="quarter">Ce trimestre</option>
      </select>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        className="h-10 w-10"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}