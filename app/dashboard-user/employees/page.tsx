// app/(dashboard)/employees/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import EmployeeStats from "@/components/compagnie-dashboard/employees/EmployeeStats";
import EmployeeFilters from "@/components/compagnie-dashboard/employees/EmployeeFilters";
import EmployeesTable from "@/components/compagnie-dashboard/employees/EmployeesTable";
import AddEmployeeModal from "@/components/compagnie-dashboard/employees/AddEmployeeModal";

// ============================================
// TYPES
// ============================================

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "admin" | "manager" | "cashier" | "employee";
  status: "active" | "inactive" | "pending";
  lastLogin: string | null;
  createdAt: string;
}

interface EmployeeStatsData {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function EmployeesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStatsData | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modale d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================

  const fetchEmployees = useCallback(async () => {
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
        role: roleFilter,
        status: statusFilter,
      });

      console.log("📡 Appel API:", `/api/users?${params}`);

      const response = await fetch(`/api/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Réponse status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const errorText = await response.text();
        console.error("❌ Erreur API:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("📦 Résultat API:", result);

      if (result.success) {
        // ✅ Mettre à jour les employés
        setEmployees(result.data.users || []);
        
        // ✅ Mettre à jour la pagination
        if (result.data.pagination) {
          setPagination({
            ...pagination,
            total: result.data.pagination.total || 0,
            totalPages: result.data.pagination.totalPages || 0,
          });
        }

        // ✅ Mettre à jour les statistiques
        if (result.data.stats) {
          setStats({
            total: result.data.stats.total || 0,
            active: result.data.stats.active || 0,
            pending: result.data.stats.pending || 0,
            inactive: result.data.stats.inactive || 0,
          });
        }
      } else {
        throw new Error(result.message || "Erreur de chargement");
      }
    } catch (error: any) {
      console.error("❌ Erreur fetchEmployees:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de charger les employés",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, roleFilter, statusFilter, router]);

  // Chargement initial
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ============================================
  // ACTIONS
  // ============================================

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors de la suppression");
      }

      toast.success("Employé supprimé avec succès");
      fetchEmployees();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de supprimer l'employé",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: "active" | "inactive") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${id}`, {
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

      toast.success(`Employé ${status === "active" ? "activé" : "désactivé"} avec succès`);
      fetchEmployees();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de mettre à jour l'employé",
      });
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${id}/resend-invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors de l'envoi");
      }

      toast.success("Invitation renvoyée avec succès");
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de renvoyer l'invitation",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  // ============================================
  // RENDU
  // ============================================

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Employés
          </h1>
          <p className="text-sm text-gray-500">
            Gérez les membres de votre équipe et leurs permissions
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Inviter un employé
        </Button>
      </div>

      {/* Statistiques */}
      {stats && <EmployeeStats stats={stats} />}

      {/* Filtres */}
      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={fetchEmployees}
        isRefreshing={isLoading}
      />

      {/* Tableau */}
      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        isActionLoading={false}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        onResendInvite={handleResendInvite}
      />

      {/* Modale d'ajout */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}