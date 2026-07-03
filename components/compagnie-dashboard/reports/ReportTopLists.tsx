// components/reports/ReportTopLists.tsx
"use client";

import { Award, TrendingUp, Users, Package, CreditCard } from "lucide-react";

interface ReportTopListsProps {
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
}

export default function ReportTopLists({
  topProducts,
  topClients,
  breakdown,
}: ReportTopListsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const totalCategory = breakdown.categories.reduce((sum, c) => sum + c.total, 0);
  const totalPayment = breakdown.payments.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ─── TOP PRODUITS ─── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Top produits</h3>
          <span className="ml-auto text-xs text-gray-400">
            {topProducts.length} produits
          </span>
        </div>

        {topProducts.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Aucune vente enregistrée
          </p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Réf: {product.reference} • {product.totalSold} vendus
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── TOP CLIENTS ─── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Top clients</h3>
          <span className="ml-auto text-xs text-gray-400">
            {topClients.length} clients
          </span>
        </div>

        {topClients.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Aucun client enregistré
          </p>
        ) : (
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div
                key={client.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {client.totalOrders} commandes
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(client.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── RÉPARTITION PAR CATÉGORIE ─── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Par catégorie</h3>
        </div>

        {breakdown.categories.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Aucune catégorie
          </p>
        ) : (
          <div className="space-y-2">
            {breakdown.categories.map((cat) => {
              const percentage = totalCategory > 0 ? (cat.total / totalCategory) * 100 : 0;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── RÉPARTITION PAR MOYEN DE PAIEMENT ─── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Moyens de paiement</h3>
        </div>

        {breakdown.payments.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Aucun paiement
          </p>
        ) : (
          <div className="space-y-2">
            {breakdown.payments.map((pay) => {
              const percentage = totalPayment > 0 ? (pay.total / totalPayment) * 100 : 0;
              const labels: Record<string, string> = {
                cash: "Espèces",
                card: "Carte bancaire",
                transfer: "Virement",
                check: "Chèque",
                mobile_payment: "Paiement mobile",
              };
              const icons: Record<string, string> = {
                cash: "💵",
                card: "💳",
                transfer: "🏦",
                check: "📝",
                mobile_payment: "📱",
              };

              return (
                <div key={pay.method}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {icons[pay.method] || "💰"} {labels[pay.method] || pay.method}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(pay.total)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}