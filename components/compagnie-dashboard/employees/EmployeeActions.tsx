// components/employees/EmployeeActions.tsx
"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Edit, 
  UserCheck, 
  UserX, 
  Mail, 
  Trash2,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface EmployeeActionsProps {
  employee: Employee;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "active" | "inactive") => void;
  onResendInvite: (id: string) => void;
  isActionLoading: boolean;
}

export default function EmployeeActions({
  employee,
  onDelete,
  onUpdateStatus,
  onResendInvite,
  isActionLoading,
}: EmployeeActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const canDelete = employee.role !== "admin" && employee.status !== "active";
  const canActivate = employee.status === "inactive";
  const canDeactivate = employee.status === "active";
  const canResend = employee.status === "pending";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => {
            setIsOpen(false);
            toast.info("Modification", {
              description: `Modification de ${employee.firstName} ${employee.lastName}`,
            });
          }}
        >
          <Edit className="h-4 w-4" />
          Modifier
        </DropdownMenuItem>

        {canResend && (
          <DropdownMenuItem 
            className="flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              onResendInvite(employee.id);
            }}
          >
            <Mail className="h-4 w-4" />
            Renvoyer l'invitation
          </DropdownMenuItem>
        )}

        {canActivate && (
          <DropdownMenuItem 
            className="flex items-center gap-2 text-green-600"
            onClick={() => {
              setIsOpen(false);
              onUpdateStatus(employee.id, "active");
            }}
          >
            <UserCheck className="h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}

        {canDeactivate && (
          <DropdownMenuItem 
            className="flex items-center gap-2 text-orange-600"
            onClick={() => {
              setIsOpen(false);
              onUpdateStatus(employee.id, "inactive");
            }}
          >
            <UserX className="h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600"
              onClick={() => {
                setIsOpen(false);
                onDelete(employee.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}