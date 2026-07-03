// components/products/ProductActions.tsx
"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Package, 
  Trash2,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  reference: string;
  status: "active" | "inactive" | "out_of_stock";
  stockQuantity: number;
}

interface ProductActionsProps {
  product: Product;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "active" | "inactive") => void;
  isActionLoading: boolean;
}

export default function ProductActions({
  product,
  onDelete,
  onUpdateStatus,
  isActionLoading,
}: ProductActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const canActivate = product.status === "inactive";
  const canDeactivate = product.status === "active" || product.status === "out_of_stock";
  const canDelete = product.status === "inactive";

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
            router.push(`/dashboard/products/${product.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
          Voir le produit
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => {
            setIsOpen(false);
            router.push(`/dashboard/products/${product.id}/edit`);
          }}
        >
          <Edit className="h-4 w-4" />
          Modifier
        </DropdownMenuItem>

        {canActivate && (
          <DropdownMenuItem 
            className="flex items-center gap-2 text-green-600"
            onClick={() => {
              setIsOpen(false);
              onUpdateStatus(product.id, "active");
            }}
          >
            <CheckCircle className="h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}

        {canDeactivate && (
          <DropdownMenuItem 
            className="flex items-center gap-2 text-orange-600"
            onClick={() => {
              setIsOpen(false);
              onUpdateStatus(product.id, "inactive");
            }}
          >
            <XCircle className="h-4 w-4" />
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
                onDelete(product.id);
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