// app/(dashboard)/clients/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ClientStats from "@/components/compagnie-dashboard/clients/ClientStats";
import ClientFilters from "@/components/compagnie-dashboard/clients/ClientFilters";
import ClientsTable from "@/components/compagnie-dashboard/clients/ClientsTable";
import CreateClientModal from "@/components/compagnie-dashboard/clients/CreateClientModal";

// ============================================
// TYPES
// ============================================

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string;
  companyName: string | null;
  siret: string | null;
  vatNumber: string | null;
  totalPurchases: number;
  totalOrders: number;
  lastPurchase: string | null;
  category: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface ClientStatsData {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function ClientsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStatsData | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
      });

      const response = await fetch(`/api/clients?${params}`, {
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
        throw new Error("Erreur lors du chargement des clients");
      }

      const result = await response.json();

      if (result.success) {
        setClients(result.data.clients || []);
        
        if (result.data.pagination) {
          setPagination({
            ...pagination,
            total: result.data.pagination.total || 0,
            totalPages: result.data.pagination.totalPages || 0,
          });
        }

        if (result.data.stats) {
          setStats({
            total: result.data.stats.total || 0,
            active: result.data.stats.active || 0,
            inactive: result.data.stats.inactive || 0,
            newThisMonth: result.data.stats.newThisMonth || 0,
          });
        }
      } else {
        throw new Error(result.message || "Erreur de chargement");
      }
    } catch (error: any) {
      console.error("❌ Erreur fetchClients:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de charger les clients",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, categoryFilter, router]);

  // Chargement initial
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // ============================================
  // ACTIONS
  // ============================================

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors de la suppression");
      }

      toast.success("Client supprimé avec succès");
      fetchClients();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de supprimer le client",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: "active" | "inactive") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }

      toast.success(`Client ${status === "active" ? "activé" : "désactivé"} avec succès`);
      fetchClients();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de mettre à jour le client",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  // ============================================
  // RENDU - ✅ PLUS DE PADDING LATÉRAL
  // ============================================

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    // ✅ Suppression de padding et margin latéraux
    <div className="w-full space-y-6">
      {/* En-tête - padding réduit */}
      <div className="flex flex-col gap-4 px-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Clients
          </h1>
          <p className="text-sm text-gray-500">
            Gérez votre carnet d'adresses et suivez vos relations clients
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      {/* Statistiques */}
      {stats && <ClientStats stats={stats} />}

      {/* Filtres */}
      <ClientFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onRefresh={fetchClients}
        isRefreshing={isLoading}
      />

      {/* Tableau - ✅ full width */}
      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Modale de création */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchClients}
      />
    </div>
  );
}