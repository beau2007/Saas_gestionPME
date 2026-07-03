// app/(dashboard)/reports/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ReportStats from "@/components/compagnie-dashboard/reports/ReportStats";
import ReportTopLists from "@/components/compagnie-dashboard/reports/ReportTopLists";
import ReportTable from "@/components/compagnie-dashboard/reports/ReportTable";

// ============================================
// TYPES
// ============================================

interface ReportData {
  stats: {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    totalClients: number;
    totalProducts: number;
    revenueChange: number;
    salesChange: number;
  };
  chart: {
    labels: string[];
    values: number[];
  };
  topProducts: Array<{
    id: string;
    name: string;
    reference: string;
    totalSold: number;
    revenue: number;
  }>;
  topClients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalSpent: number;
    totalOrders: number;
  }>;
  breakdown: {
    categories: Array<{ category: string; total: number }>;
    payments: Array<{ method: string; total: number }>;
  };
  sales: Array<{
    id: string;
    reference: string;
    clientName: string;
    total: number;
    status: string;
    paymentMethod: string;
    saleDate: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [page, setPage] = useState(1);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================

  const fetchReportData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams({
        period,
        page: page.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/reports?${params}`, {
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
        throw new Error("Erreur lors du chargement des rapports");
      }

      const result = await response.json();
      
      if (result.success) {
        setReportData(result.data);
      } else {
        throw new Error(result.message || "Données non disponibles");
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de charger les rapports",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, period, page]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ============================================
  // EXPORT
  // ============================================

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/reports/export?period=${period}&format=${format}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'export");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-${period}.${format === "csv" ? "csv" : "pdf"}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Export réussi", {
        description: `Le rapport a été exporté en ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible d'exporter le rapport",
      });
    }
  };

  // ============================================
  // RENDU
  // ============================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-gray-600">Impossible de charger les données</p>
        <Button className="mt-4" onClick={fetchReportData}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* ─── EN-TÊTE ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Rapports
          </h1>
          <p className="text-sm text-gray-500">
            Analyse détaillée de votre activité
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Sélecteur de période */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {[
              { value: "week", label: "Sem." },
              { value: "month", label: "Mois" },
              { value: "quarter", label: "Trim." },
              { value: "year", label: "Année" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  period === p.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ─── STATISTIQUES + GRAPHIQUE ─── */}
      <ReportStats stats={reportData.stats} chart={reportData.chart} />

      {/* ─── TOP PRODUITS + TOP CLIENTS ─── */}
      <ReportTopLists
        topProducts={reportData.topProducts}
        topClients={reportData.topClients}
        breakdown={reportData.breakdown}
      />

      {/* ─── TABLEAU DES VENTES ─── */}
      <ReportTable
        sales={reportData.sales}
        pagination={reportData.pagination}
        onPageChange={setPage}
        period={period}
      />
    </div>
  );
}