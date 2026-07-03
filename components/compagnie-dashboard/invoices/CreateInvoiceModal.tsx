// components/invoices/CreateInvoiceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2, User, Mail, Calendar, Euro, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreateInvoiceModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  inline?: boolean;
}

interface LineItem {
  id: number;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function CreateInvoiceModal({ 
  isOpen = false,
  onClose, 
  onSuccess,
  inline = false,
}: CreateInvoiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // États du formulaire - Client
  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  
  // ✅ Nouveau : Mode saisie manuelle
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualClientName, setManualClientName] = useState("");
  const [manualClientEmail, setManualClientEmail] = useState("");
  
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, name: "", quantity: 1, price: 0 },
  ]);
  const [nextId, setNextId] = useState(2);
  
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [footerText, setFooterText] = useState("");

  // Recherche de clients
  useEffect(() => {
    const searchClients = async () => {
      if (!clientSearch.trim() || clientSearch.length < 2) {
        setClients([]);
        return;
      }

      setIsSearching(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/clients?search=${encodeURIComponent(clientSearch)}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setClients(result.data.clients);
            setShowClientDropdown(true);
          }
        }
      } catch (error) {
        console.error("Erreur de recherche:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [clientSearch]);

  // Sélectionner un client existant
  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setClientId(client.id);
    setClientSearch(`${client.firstName} ${client.lastName}`);
    setShowClientDropdown(false);
    setIsManualEntry(false);
  };

  // Basculer vers la saisie manuelle
  const toggleManualEntry = () => {
    setIsManualEntry(!isManualEntry);
    if (!isManualEntry) {
      // Réinitialiser la sélection
      setSelectedClient(null);
      setClientId("");
      setClientSearch("");
      setManualClientName("");
      setManualClientEmail("");
    }
  };

  // Gérer les lignes
  const addItem = () => {
    setItems([...items, { id: nextId, name: "", quantity: 1, price: 0 }]);
    setNextId(nextId + 1);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) {
      toast.warning("Attention", {
        description: "Une facture doit contenir au moins un article.",
      });
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculs
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.2;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    // Client valide
    const hasValidClient = isManualEntry 
      ? manualClientName.trim().length > 0 
      : selectedClient !== null;

    if (!hasValidClient) return false;

    // Articles valides
    const hasValidItems = items.every((item) => 
      item.name.trim().length > 0 && item.price > 0
    );

    return hasValidItems;
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    let clientIdToUse = clientId;

    // Si mode manuel, on crée le client d'abord
    if (isManualEntry) {
      if (!manualClientName.trim()) {
        toast.error("Nom du client requis", {
          description: "Veuillez entrer le nom du client.",
        });
        return;
      }

      // Créer le client
      try {
        const token = localStorage.getItem("token");
        const nameParts = manualClientName.trim().split(" ");
        const firstName = nameParts[0] || "Client";
        const lastName = nameParts.slice(1).join(" ") || "Manuel";

        const response = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: manualClientEmail || `client-${Date.now()}@temp.com`,
          }),
        });

        if (!response.ok) {
          throw new Error("Impossible de créer le client");
        }

        const result = await response.json();
        clientIdToUse = result.data.id;
        
        toast.success("Client créé", {
          description: `${manualClientName} a été ajouté à vos clients.`,
        });
      } catch (error: any) {
        toast.error("Erreur", {
          description: error.message || "Impossible de créer le client.",
        });
        return;
      }
    } else if (!selectedClient) {
      toast.error("Client requis", {
        description: "Veuillez sélectionner un client ou saisir manuellement.",
      });
      return;
    } else {
      clientIdToUse = selectedClient.id;
    }

    // Vérifier les articles
    const invalidItems = items.filter((item) => !item.name || item.price <= 0);
    if (invalidItems.length > 0) {
      toast.error("Articles invalides", {
        description: "Veuillez remplir tous les articles correctement.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        clientId: clientIdToUse,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes,
        footerText,
      };

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création");
      }

      toast.success("Facture créée !", {
        description: `Facture pour ${isManualEntry ? manualClientName : selectedClient?.firstName + " " + selectedClient?.lastName} créée avec succès.`,
      });

      // Réinitialiser le formulaire
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de créer la facture.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setClientId("");
    setClientSearch("");
    setSelectedClient(null);
    setIsManualEntry(false);
    setManualClientName("");
    setManualClientEmail("");
    setItems([{ id: 1, name: "", quantity: 1, price: 0 }]);
    setNextId(2);
    setDueDate("");
    setNotes("");
    setFooterText("");
  };

  if (!isOpen && !inline) return null;

  // Nom du client affiché
  const getClientDisplayName = () => {
    if (isManualEntry) {
      return manualClientName || "Saisie manuelle";
    }
    if (selectedClient) {
      return `${selectedClient.firstName} ${selectedClient.lastName}`;
    }
    return "Aucun client sélectionné";
  };

  const inner = (
    <div className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* En-tête */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Créer une facture
            </h2>
            <p className="text-sm text-gray-500">
              Remplissez les informations pour générer une facture
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* ─── SECTION CLIENT ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Informations client
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleManualEntry}
                className="gap-1"
              >
                {isManualEntry ? "Rechercher un client" : "Saisir manuellement"}
              </Button>
            </div>
            
            {isManualEntry ? (
              // ✅ MODE SAISIE MANUELLE
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Nom complet du client *"
                    value={manualClientName}
                    onChange={(e) => setManualClientName(e.target.value)}
                    className="pl-9 h-11"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email du client (optionnel)"
                    value={manualClientEmail}
                    onChange={(e) => setManualClientEmail(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>Le client sera automatiquement créé dans votre répertoire.</span>
                </div>
              </div>
            ) : (
              // ✅ MODE RECHERCHE
              <>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher un client existant..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      onFocus={() => clientSearch.length >= 2 && setShowClientDropdown(true)}
                      className="pl-9 h-11"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                    )}
                  </div>

                  {/* Dropdown des clients */}
                  {showClientDropdown && clients.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => selectClient(client)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                            {client.firstName[0]}{client.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showClientDropdown && clients.length === 0 && clientSearch.length >= 2 && !isSearching && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg">
                      <p className="text-sm text-gray-500">Aucun client trouvé</p>
                      <button
                        type="button"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setShowClientDropdown(false);
                          setIsManualEntry(true);
                          setManualClientName(clientSearch);
                        }}
                      >
                        Créer "{clientSearch}" comme nouveau client
                      </button>
                    </div>
                  )}
                </div>

                {/* Client sélectionné */}
                {selectedClient && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-3 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 text-blue-700 font-semibold">
                        {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedClient.firstName} {selectedClient.lastName}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedClient.email}
                          </span>
                          {selectedClient.phone && (
                            <span className="flex items-center gap-1">
                              📞 {selectedClient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(null);
                        setClientSearch("");
                      }}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Changer
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Affichage du client actuel */}
            <div className="mt-2 text-xs text-gray-400">
              Client : <span className="font-medium text-gray-600">{getClientDisplayName()}</span>
            </div>
          </div>

          {/* ─── SECTION ARTICLES ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Articles
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-end gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Description *
                    </label>
                    <Input
                      placeholder="Nom de l'article..."
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-medium text-gray-700">
                      Qté
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium text-gray-700">
                      Prix HT *
                    </label>
                    <div className="relative mt-1">
                      <Euro className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                        className="pl-6 h-9"
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right pt-4">
                    <span className="text-xs font-medium text-gray-500">
                      {(item.quantity * item.price).toFixed(2)} €
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="mb-0.5 h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* ─── TOTAUX ─── */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total HT</span>
                <span className="font-medium text-gray-900">
                  {calculateSubtotal().toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="font-medium text-gray-900">
                  {calculateTax().toFixed(2)} €
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total TTC</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calculateTotal().toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── OPTIONS ─── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date d'échéance
              </label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pied de page
              </label>
              <Input
                placeholder="Merci de votre confiance"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              placeholder="Informations complémentaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              rows={2}
            />
          </div>

          {/* ─── ACTIONS ─── */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la facture"
              )}
            </Button>
          </div>
        </form>
    </div>
  );

  if (inline) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {inner}
    </div>
  );
}