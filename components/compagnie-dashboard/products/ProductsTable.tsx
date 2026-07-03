// components/products/ProductsTable.tsx
"use client";

import { Package, Loader2, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductActions from "./ProductActions";

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

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  isActionLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "active" | "inactive") => void;
}

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  out_of_stock: "Rupture",
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  out_of_stock: "bg-red-100 text-red-700",
};

export default function ProductsTable({
  products,
  isLoading,
  isActionLoading,
  pagination,
  onPageChange,
  onDelete,
  onUpdateStatus,
}: ProductsTableProps) {
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
    });
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Aucun produit trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun produit ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Version Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const isLowStock = product.stockQuantity <= product.stockMin && product.stockQuantity > 0;
              const isOutOfStock = product.stockQuantity === 0;

              return (
                <tr key={product.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.reference}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(product.salePrice)}
                      </p>
                      <p className="text-xs text-gray-400">
                        HT: {formatCurrency(product.purchasePrice)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        isOutOfStock ? "text-red-600" :
                        isLowStock ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {product.stockQuantity}
                      </span>
                      {isLowStock && !isOutOfStock && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {isOutOfStock && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs text-gray-400">
                        / {product.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Seuil: {product.stockMin}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[product.status]}>
                      {statusLabels[product.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ProductActions
                      product={product}
                      onDelete={onDelete}
                      onUpdateStatus={onUpdateStatus}
                      isActionLoading={isActionLoading}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Version Mobile */}
      <div className="divide-y divide-gray-100 lg:hidden">
        {products.map((product) => {
          const isLowStock = product.stockQuantity <= product.stockMin && product.stockQuantity > 0;
          const isOutOfStock = product.stockQuantity === 0;

          return (
            <div key={product.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">Réf: {product.reference}</p>
                </div>
                <Badge className={statusColors[product.status]}>
                  {statusLabels[product.status]}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Prix:</span>
                  <span className="ml-1 font-medium">{formatCurrency(product.salePrice)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className={`ml-1 font-medium ${
                    isOutOfStock ? "text-red-600" :
                    isLowStock ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {product.stockQuantity} {product.unit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Catégorie:</span>
                  <span className="ml-1">{product.category || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Seuil:</span>
                  <span className="ml-1">{product.stockMin}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <ProductActions
                  product={product}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                  isActionLoading={isActionLoading}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            {pagination.total} produit(s)
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