// components/clients/CreateClientModal.tsx
"use client";

import { useState } from "react";
import { X, Loader2, User, Mail, Phone, MapPin, Building2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    companyName: "",
    siret: "",
    vatNumber: "",
    category: "particulier",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création");
      }

      toast.success("Client créé avec succès !", {
        description: `${formData.firstName} ${formData.lastName} a été ajouté à votre carnet d'adresses.`,
      });

      onSuccess();
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "France",
        companyName: "",
        siret: "",
        vatNumber: "",
        category: "particulier",
        notes: "",
      });
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de créer le client",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* En-tête */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Ajouter un client
            </h2>
            <p className="text-sm text-gray-500">
              Remplissez les informations du client
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Identité */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Jean"
                  className="pl-9"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <Input
                placeholder="Dupont"
                className="mt-1"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="jean@exemple.com"
                  className="pl-9"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="06 12 34 56 78"
                  className="pl-9"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="12 Rue des Lilas"
                  className="pl-9"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code postal
              </label>
              <Input
                placeholder="75001"
                className="mt-1"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ville
              </label>
              <Input
                placeholder="Paris"
                className="mt-1"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pays
              </label>
              <select
                className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Informations professionnelles
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Société
                </label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Ma Société"
                    className="pl-9"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SIRET
                </label>
                <div className="relative mt-1">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="12345678901234"
                    className="pl-9"
                    value={formData.siret}
                    onChange={(e) =>
                      setFormData({ ...formData, siret: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="particulier">Particulier</option>
              <option value="professionnel">Professionnel</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Ajouter le client"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}