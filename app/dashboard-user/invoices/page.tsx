// app/(dashboard)/invoices/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import InvoiceStats from "@/components/compagnie-dashboard/invoices/InvoiceStats";
import InvoiceFilters from "@/components/compagnie-dashboard/invoices/InvoiceFilters";
import InvoicesTable from "@/components/compagnie-dashboard/invoices/InvoiceTable";

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

interface InvoiceStatsData {
  total: number;
  totalAmount: number;
  statusCounts: Array<{ status: string; _count: number }>;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStatsData | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Charger les factures
  const fetchInvoices = async () => {
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
        status: statusFilter,
        search: searchTerm,
      });

      const response = await fetch(`/api/invoices?${params}`, {
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
        throw new Error("Erreur de chargement");
      }

      const result = await response.json();

      if (result.success) {
        setInvoices(result.data.invoices);
        setPagination({
          ...pagination,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        });
        
        // Statistiques
        if (result.data.totals || result.data.statusCounts) {
          setStats({
            total: result.data.pagination.total,
            totalAmount: result.data.totals?.totalAmount || 0,
            statusCounts: result.data.statusCounts || [],
          });
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de charger les factures",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, statusFilter, searchTerm, dateFilter]);

  // Actions
  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Facture supprimée");
        fetchInvoices();
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.message });
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${id}/mark-paid`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Facture marquée comme payée");
        fetchInvoices();
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.message });
      }
    } catch (error) {
      toast.error("Erreur lors du marquage");
    }
  };

  const handleSend = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${id}/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Facture envoyée par email");
        fetchInvoices();
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.message });
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const result = await response.json();
        toast.error("Erreur", { description: result.message });
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  if (isLoading && invoices.length === 0) {
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
            Factures
          </h1>
          <p className="text-sm text-gray-500">
            Gérez vos factures, suivez les paiements et relancez vos clients
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard-user/invoices/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* Statistiques */}
      {stats && <InvoiceStats stats={stats} />}

      {/* Filtres */}
      <InvoiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onRefresh={fetchInvoices}
      />

      {/* Tableau */}
      <InvoicesTable
        invoices={invoices}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onDelete={handleDelete}
        onMarkPaid={handleMarkPaid}
        onSend={handleSend}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}