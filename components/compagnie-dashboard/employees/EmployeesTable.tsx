// components/employees/EmployeesTable.tsx
"use client";

import { Users, Loader2, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmployeeActions from "./EmployeeActions";

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

interface EmployeesTableProps {
  employees: Employee[];
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
  onResendInvite: (id: string) => void;
}

const roleLabels = {
  admin: "Administrateur",
  manager: "Manager",
  cashier: "Caissier",
  employee: "Employé",
};

const roleColors = {
  admin: "bg-red-100 text-red-700",
  manager: "bg-blue-100 text-blue-700",
  cashier: "bg-green-100 text-green-700",
  employee: "bg-gray-100 text-gray-700",
};

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function EmployeesTable({
  employees,
  isLoading,
  isActionLoading,
  pagination,
  onPageChange,
  onDelete,
  onUpdateStatus,
  onResendInvite,
}: EmployeesTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Aucun employé trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun employé ne correspond à vos critères de recherche.
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
                Employé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((employee) => (
              <tr key={employee.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                      {getInitials(employee.firstName, employee.lastName)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {employee.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-3 w-3" />
                      {employee.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(employee.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={roleColors[employee.role]}>
                    {roleLabels[employee.role]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[employee.status]}>
                    {statusLabels[employee.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(employee.lastLogin)}
                </td>
                <td className="px-6 py-4 text-right">
                  <EmployeeActions
                    employee={employee}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                    onResendInvite={onResendInvite}
                    isActionLoading={isActionLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Mobile */}
      <div className="divide-y divide-gray-100 lg:hidden">
        {employees.map((employee) => (
          <div key={employee.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                  {getInitials(employee.firstName, employee.lastName)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
              </div>
              <div>
                <Badge className={statusColors[employee.status]}>
                  {statusLabels[employee.status]}
                </Badge>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className={roleColors[employee.role]}>
                {roleLabels[employee.role]}
              </Badge>
              {employee.phone && (
                <span className="text-xs text-gray-500">{employee.phone}</span>
              )}
            </div>
            <div className="mt-3 flex justify-end">
              <EmployeeActions
                employee={employee}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                onResendInvite={onResendInvite}
                isActionLoading={isActionLoading}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            {pagination.total} employé(s)
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