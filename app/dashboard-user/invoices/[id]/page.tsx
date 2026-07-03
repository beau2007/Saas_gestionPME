// app/(dashboard)/invoices/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  Printer,
  Loader2,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import InvoiceStatusBadge from "@/components/compagnie-dashboard/invoices/InvoiceStatusBadge";

interface InvoiceItem {
  id: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  total: number;
  productName: string;
  productReference?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  notes?: string;
  footerText?: string;
  sentAt?: string;
  paidAt?: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    companyName?: string;
    siret?: string;
  } | null;
  company: {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
    siret?: string;
  };
  sale?: {
    id: string;
    reference: string;
    saleItems: InvoiceItem[];
  };
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const response = await fetch(`/api/invoices/${invoiceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Facture non trouvée");
            router.push("/dashboard/invoices");
            return;
          }
          throw new Error("Erreur de chargement");
        }

        const result = await response.json();
        if (result.success && result.data) setInvoice(result.data);
      } catch (error: any) {
        toast.error("Erreur de chargement de la facture");
      } finally {
        setIsLoading(false);
      }
    };

    if (invoiceId) fetchInvoice();
  }, [invoiceId, router]);

  const handleMarkPaid = async () => {
    if (!invoice) return;
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${invoice.id}/mark-paid`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      toast.success("Facture marquée comme payée");
      const updated = await response.json();
      setInvoice(updated.data);
    } catch {
      toast.error("Impossible de modifier le statut");
    } finally { setIsActionLoading(false); }
  };

  const handleSend = async () => {
    if (!invoice) return;
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      toast.success("Facture envoyée");
      const result = await response.json();
      setInvoice(result.data);
    } catch {
      toast.error("Échec de l'envoi");
    } finally { setIsActionLoading(false); }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${invoice.invoiceNumber}.pdf`;
      link.click();
      toast.success("Téléchargement démarré");
    } catch {
      toast.error("Erreur de téléchargement");
    } finally { setIsActionLoading(false); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Récupération des données...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white border rounded-xl shadow-sm max-w-md mx-auto mt-12">
        <div className="p-3 bg-red-50 rounded-full text-red-500 border border-red-100">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-950">Facture introuvable</h2>
        <p className="text-sm text-slate-500 text-center mt-1">Le document demandé n&apos;existe pas ou a été déplacé.</p>
        <Link href="/dashboard-user/invoices" className="w-full mt-5">
          <Button className="w-full">Retour au tableau de bord</Button>
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const isCanceled = invoice.status === "canceled";
  const canEdit = !isPaid && !isCanceled;
  const isOverdue = new Date(invoice.dueDate) < new Date() && !isPaid && !isCanceled;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:p-0 print:max-w-full">
      
      {/* Barre d'actions supérieure */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard-user/invoices">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Facture {invoice.invoiceNumber}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Émise le {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {canEdit && invoice.status !== "sent" && (
            <>
              <Button variant="outline" size="sm" onClick={handleSend} disabled={isActionLoading} className="rounded-lg border-slate-200">
                <Send className="mr-2 h-3.5 w-3.5 text-slate-500" /> Envoyer
              </Button>
              <Button variant="outline" size="sm" onClick={handleMarkPaid} disabled={isActionLoading} className="rounded-lg border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Encaissée
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isActionLoading} className="rounded-lg border-slate-200">
            <Download className="mr-2 h-3.5 w-3.5 text-slate-500" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-lg border-slate-200">
            <Printer className="mr-2 h-3.5 w-3.5 text-slate-500" /> Imprimer
          </Button>
        </div>
      </div>

      {/* Grid d'informations d'état rapides */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 print:hidden">
        <Card className="shadow-none border-slate-200/60 bg-slate-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border text-slate-500"><Calendar className="h-4 w-4" /></div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Date Limite</p>
              <p className={`text-sm font-semibold ${isOverdue ? "text-red-600" : "text-slate-800"}`}>{formatDate(invoice.dueDate)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-200/60 bg-slate-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border text-slate-500"><Clock className="h-4 w-4" /></div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Historique</p>
              <p className="text-sm font-semibold text-slate-800">
                {invoice.paidAt ? `Payée le ${formatDate(invoice.paidAt)}` : invoice.sentAt ? `Envoyée le ${formatDate(invoice.sentAt)}` : "Non envoyée"}
              </p>
            </div>
          </CardContent>
        </Card>
        {invoice.sale && (
          <Card className="shadow-none border-slate-200/60 bg-slate-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border text-slate-500"><Briefcase className="h-4 w-4" /></div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Commande de référence</p>
                <Link href={`/dashboard/sales/${invoice.sale.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                  {invoice.sale.reference}
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Corps Principal - Look Papier Facture */}
      <Card className="shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-slate-200/80 rounded-2xl overflow-hidden bg-white print:border-none print:shadow-none">
        <CardContent className="p-8 md:p-12 space-y-10">
          
          {/* Section Identités (Émetteur vs Récepteur) */}
          <div className="grid md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
            {/* Émetteur */}
            <div className="space-y-2.5 text-sm">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">De (Émetteur)</p>
              <h3 className="font-bold text-slate-900 text-base">{invoice.company.name}</h3>
              <div className="text-slate-500 space-y-0.5 font-medium">
                {invoice.company.address && <p>{invoice.company.address}</p>}
                {(invoice.company.postalCode || invoice.company.city) && (
                  <p>{invoice.company.postalCode} {invoice.company.city}, {invoice.company.country || "France"}</p>
                )}
                <div className="pt-2 text-xs space-y-0.5 text-slate-400 font-normal">
                  {invoice.company.siret && <p>SIRET : {invoice.company.siret}</p>}
                  {invoice.company.email && <p>Email : {invoice.company.email}</p>}
                </div>
              </div>
            </div>

            {/* Destinataire */}
            <div className="space-y-2.5 text-sm md:text-right md:flex md:flex-col md:items-end">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Facturé à (Client)</p>
              {invoice.client ? (
                <>
                  <h3 className="font-bold text-slate-900 text-base">
                    {invoice.client.companyName || `${invoice.client.firstName} ${invoice.client.lastName}`}
                  </h3>
                  <div className="text-slate-500 space-y-0.5 font-medium md:text-right">
                    {invoice.client.companyName && <p className="text-xs text-slate-400 font-normal">Contact : {invoice.client.firstName} {invoice.client.lastName}</p>}
                    {invoice.client.address && <p>{invoice.client.address}</p>}
                    {(invoice.client.postalCode || invoice.client.city) && (
                      <p>{invoice.client.postalCode} {invoice.client.city}</p>
                    )}
                    <div className="pt-2 text-xs space-y-0.5 text-slate-400 font-normal md:text-right">
                      {invoice.client.email && <p>{invoice.client.email}</p>}
                      {invoice.client.phone && <p>{invoice.client.phone}</p>}
                      {invoice.client.siret && <p>SIRET : {invoice.client.siret}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 italic">Aucune coordonnée client</p>
              )}
            </div>
          </div>

          {/* Tableau d'Articles Épuré */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Détail des prestations</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-3 text-left font-semibold">Désignation</th>
                    <th className="pb-3 text-right font-semibold w-16">Qté</th>
                    <th className="pb-3 text-right font-semibold w-28">Prix Unit. HT</th>
                    <th className="pb-3 text-right font-semibold w-32">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invoice.sale?.saleItems.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-slate-900">{item.productName}</p>
                        {item.productReference && (
                          <p className="text-xs text-slate-400 mt-0.5">Réf: {item.productReference}</p>
                        )}
                      </td>
                      <td className="py-4 text-right text-slate-500 font-medium">{item.quantity}</td>
                      <td className="py-4 text-right text-slate-600 font-medium">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux & Notes (Section de bas de page) */}
          <div className="grid md:grid-cols-5 gap-8 pt-4">
            
            {/* Notes de gauche */}
            <div className="md:col-span-3 space-y-4">
              {invoice.notes && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notes & Conditions</h4>
                  <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Bloc de facturation droite */}
            <div className="md:col-span-2 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Sous-total HT</span>
                <span className="text-slate-900">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>TVA (20%)</span>
                <span className="text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Remise appliquée</span>
                  <span>-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}

              <Separator className="my-2 bg-slate-200" />
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total TTC</span>
                <span className="text-xl font-black text-blue-600 tracking-tight">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Mentions Légales Pied de Page */}
          {invoice.footerText && (
            <div className="border-t border-slate-100 pt-6 text-center">
              <p className="text-[11px] text-slate-400 italic leading-relaxed max-w-2xl mx-auto">
                {invoice.footerText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}