// components/invoices/InvoiceActions.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Send, Download, CheckCircle, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onSend: (id: string) => void;
  onDownloadPDF: (id: string) => void;
}

export default function InvoiceActions({
  invoiceId,
  status,
  onDelete,
  onMarkPaid,
  onSend,
  onDownloadPDF,
}: InvoiceActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const isPaidOrCanceled = status === "paid" || status === "canceled";
  const isPaidOrSent = status === "paid" || status === "sent";

  // ✅ Téléchargement du PDF avec appel API
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erreur lors du téléchargement");
      }

      // Récupérer le blob du PDF
      const blob = await response.blob();
      
      // Créer l'URL de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF téléchargé", {
        description: "La facture a été téléchargée avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur de téléchargement:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de télécharger le PDF.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-600 data-[state=open]:bg-slate-100"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 shadow-md border-slate-200">
        {/* Voir les détails */}
        <DropdownMenuItem 
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 cursor-pointer focus:bg-slate-50"
          onClick={() => window.location.href = `/dashboard-user/invoices/${invoiceId}`}
        >
          <Eye className="h-4 w-4 text-slate-400" />
          <span>Voir la facture</span>
        </DropdownMenuItem>

        {/* Télécharger - AVEC APPEL API */}
        <DropdownMenuItem 
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 cursor-pointer focus:bg-slate-50 disabled:opacity-50"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              <span>Téléchargement...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 text-slate-400" />
              <span>Télécharger PDF</span>
            </>
          )}
        </DropdownMenuItem>

        {/* Actions conditionnelles */}
        {!isPaidOrCanceled && (
          <>
            <DropdownMenuSeparator className="bg-slate-100" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 cursor-pointer focus:bg-slate-50"
              onClick={() => onSend(invoiceId)}
            >
              <Send className="h-4 w-4 text-slate-400" />
              <span>Envoyer par email</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-emerald-700 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
              onClick={() => onMarkPaid(invoiceId)}
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Marquer comme payée</span>
            </DropdownMenuItem>
          </>
        )}

        {/* Suppression */}
        {!isPaidOrSent && (
          <>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 font-medium cursor-pointer focus:bg-red-50 focus:text-red-600"
              onClick={() => onDelete(invoiceId)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}