// components/clients/ClientFilters.tsx
"use client";

import { Search, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function ClientFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  onRefresh,
  isRefreshing,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un client..."
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
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">Toutes les catégories</option>
        <option value="particulier">Particulier</option>
        <option value="professionnel">Professionnel</option>
        <option value="entreprise">Entreprise</option>
      </select>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-10 w-10"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}