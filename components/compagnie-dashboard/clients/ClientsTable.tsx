// components/clients/ClientsTable.tsx
"use client";

import { useState } from "react";
import { 
  Users, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Trash2,
  ShoppingBag,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

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

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
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
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
};

export default function ClientsTable({
  clients,
  isLoading,
  pagination,
  onPageChange,
  onDelete,
  onUpdateStatus,
}: ClientsTableProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFullName = (client: Client) => {
    return `${client.firstName} ${client.lastName}`;
  };

  const getInitials = (client: Client) => {
    return `${client.firstName?.charAt(0) || ""}${client.lastName?.charAt(0) || ""}`;
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Aucun client trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun client ne correspond à vos critères de recherche.
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
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Achats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dernier achat
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
            {clients.map((client) => (
              <tr key={client.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                      {getInitials(client)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getFullName(client)}
                      </p>
                      {client.companyName && (
                        <p className="text-sm text-gray-500">
                          {client.companyName}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm">
                    {client.email && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {(client.address || client.city) && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {client.address && `${client.address}, `}
                          {client.city}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(client.totalPurchases)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {client.totalOrders} commandes
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(client.lastPurchase)}
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[client.status]}>
                    {statusLabels[client.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu open={menuOpen === client.id} onOpenChange={(open) => setMenuOpen(open ? client.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setMenuOpen(null);
                          router.push(`/dashboard/clients/${client.id}`);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setMenuOpen(null);
                          router.push(`/dashboard/clients/${client.id}/edit`);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      {client.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            setMenuOpen(null);
                            onUpdateStatus(client.id, "inactive");
                          }}
                          className="flex items-center gap-2 text-orange-600"
                        >
                          <UserX className="h-4 w-4" />
                          Désactiver
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            setMenuOpen(null);
                            onUpdateStatus(client.id, "active");
                          }}
                          className="flex items-center gap-2 text-green-600"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activer
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setMenuOpen(null);
                          onDelete(client.id);
                        }}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Mobile */}
      <div className="divide-y divide-gray-100 lg:hidden">
        {clients.map((client) => (
          <div key={client.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                  {getInitials(client)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getFullName(client)}
                  </p>
                  {client.companyName && (
                    <p className="text-sm text-gray-500">{client.companyName}</p>
                  )}
                </div>
              </div>
              <Badge className={statusColors[client.status]}>
                {statusLabels[client.status]}
              </Badge>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-1 text-sm text-gray-500">
              {client.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {client.phone}
                </div>
              )}
              <div className="col-span-2 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" />
                {formatCurrency(client.totalPurchases)} - {client.totalOrders} commandes
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Dernier achat: {formatDate(client.lastPurchase)}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <DropdownMenu open={menuOpen === client.id} onOpenChange={(open) => setMenuOpen(open ? client.id : null)}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuOpen(null);
                      router.push(`/dashboard/clients/${client.id}`);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuOpen(null);
                      router.push(`/dashboard/clients/${client.id}/edit`);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  {client.status === "active" ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setMenuOpen(null);
                        onUpdateStatus(client.id, "inactive");
                      }}
                      className="flex items-center gap-2 text-orange-600"
                    >
                      <UserX className="h-4 w-4" />
                      Désactiver
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        setMenuOpen(null);
                        onUpdateStatus(client.id, "active");
                      }}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <UserCheck className="h-4 w-4" />
                      Activer
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuOpen(null);
                      onDelete(client.id);
                    }}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            {pagination.total} client(s)
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