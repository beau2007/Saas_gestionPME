// app/(dashboard)/products/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ProductFilters from "@/components/compagnie-dashboard/products/ProductFilters";
import ProductsTable from "@/components/compagnie-dashboard/products/ProductsTable";
import CreateProductModal from "@/components/compagnie-dashboard/products/CreateProductModal";
import ProductStats from "@/components/compagnie-dashboard/products/ProductStats";

// ============================================
// TYPES
// ============================================

interface Product {
  id: string;
  name: string;
  reference: string;
  description: string | null;
  purchasePrice: number;
  salePrice: number;
  taxRate: number;
  stockQuantity: number;
  stockMin: number;
  category: string | null;
  subcategory: string | null;
  unit: string;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

interface ProductStatsData {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function ProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStatsData | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================

  const fetchProducts = useCallback(async () => {
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
        category: categoryFilter,
        status: statusFilter,
        lowStock: lowStockFilter.toString(),
      });

      console.log("📡 Appel API:", `/api/products?${params}`);

      const response = await fetch(`/api/products?${params}`, {
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
        const errorText = await response.text();
        console.error("❌ Erreur API:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("📦 Résultat API:", result);

      if (result.success) {
        setProducts(result.data.products || []);
        setCategories(result.data.categories || []);
        
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
            lowStock: result.data.stats.lowStock || 0,
            outOfStock: result.data.stats.outOfStock || 0,
          });
        }
      } else {
        throw new Error(result.message || "Erreur de chargement");
      }
    } catch (error: any) {
      console.error("❌ Erreur fetchProducts:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de charger les produits",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, categoryFilter, statusFilter, lowStockFilter, router]);

  // Chargement initial
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ============================================
  // ACTIONS
  // ============================================

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors de la suppression");
      }

      toast.success("Produit supprimé avec succès");
      fetchProducts();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de supprimer le produit",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "active" | "inactive") => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/${id}`, {
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

      toast.success(`Produit ${status === "active" ? "activé" : "désactivé"} avec succès`);
      fetchProducts();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de mettre à jour le produit",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  // ============================================
  // RENDU
  // ============================================

  if (isLoading && products.length === 0) {
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
            Produits
          </h1>
          <p className="text-sm text-gray-500">
            Gérez votre catalogue de produits et suivez votre stock
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isActionLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {/* Statistiques */}
      {stats && <ProductStats stats={stats} />}

      {/* Filtres */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        lowStockFilter={lowStockFilter}
        setLowStockFilter={setLowStockFilter}
        categories={categories}
        onRefresh={fetchProducts}
        isRefreshing={isLoading}
      />

      {/* Tableau */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        isActionLoading={isActionLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Modale de création */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
}