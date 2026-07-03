// components/products/CreateProductModal.tsx
"use client";

import { useState } from "react";
import { X, Loader2, Euro, Package, Tag, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    reference: "",
    description: "",
    purchasePrice: 0,
    salePrice: 0,
    taxRate: 20,
    stockQuantity: 0,
    stockMin: 0,
    category: "",
    subcategory: "",
    unit: "unité",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/products", {
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

      toast.success("Produit créé avec succès !", {
        description: `${formData.name} a été ajouté à votre catalogue.`,
      });

      onSuccess();
      onClose();
      setFormData({
        name: "",
        reference: "",
        description: "",
        purchasePrice: 0,
        salePrice: 0,
        taxRate: 20,
        stockQuantity: 0,
        stockMin: 0,
        category: "",
        subcategory: "",
        unit: "unité",
      });
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description: error.message || "Impossible de créer le produit",
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
              Ajouter un produit
            </h2>
            <p className="text-sm text-gray-500">
              Remplissez les informations du produit
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du produit *
              </label>
              <div className="relative mt-1">
                <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Pizza Margherita"
                  className="pl-9"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Référence *
              </label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="PIZ-001"
                  className="pl-9"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Description du produit..."
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix d'achat HT
              </label>
              <div className="relative mt-1">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purchasePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix de vente HT *
              </label>
              <div className="relative mt-1">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TVA (%)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="mt-1"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxRate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantité en stock
              </label>
              <Input
                type="number"
                min="0"
                className="mt-1"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seuil d'alerte
              </label>
              <Input
                type="number"
                min="0"
                className="mt-1"
                placeholder="5"
                value={formData.stockMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockMin: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <Input
                placeholder="Pizzas"
                className="mt-1"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sous-catégorie
              </label>
              <Input
                placeholder="Classiques"
                className="mt-1"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unité
            </label>
            <Input
              placeholder="unité, kg, litre..."
              className="mt-1"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            />
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
                "Ajouter le produit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}