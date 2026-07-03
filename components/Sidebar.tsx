// components/dashboard/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  UserCog,
  ChartBar,
  HelpCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard-user",
    icon: LayoutDashboard,
    exact: true, // ✅ Exact match pour le dashboard
  },
  {
    name: "Employés",
    href: "/dashboard-user/employees",
    icon: Users,
    exact: false,
  },
  {
    name: "Produits",
    href: "/dashboard-user/products",
    icon: Package,
    exact: false,
  },
  {
    name: "Ventes",
    href: "/dashboard-user/sales",
    icon: ShoppingBag,
    exact: false,
  },
  {
    name: "Clients",
    href: "/dashboard-user/clients",
    icon: UserCog,
    exact: false,
  },
  {
    name: "Factures",
    href: "/dashboard-user/invoices",
    icon: FileText,
    exact: false,
  },
  {
    name: "Rapports",
    href: "/dashboard-user/reports",
    icon: ChartBar,
    exact: false,
  },
  {
    name: "Paramètres",
    href: "/dashboard-user/settings",
    icon: Settings,
    exact: false,
  },
];

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company?: {
    id: string;
    name: string;
  };
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Charger les données utilisateur
  useEffect(() => {
    const loadUserData = () => {
      try {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // ✅ DÉCONNEXION - VERSION CORRIGÉE
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // ✅ Nettoyer le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      
      // ✅ Nettoyer les cookies
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast.success("Déconnexion réussie", {
        description: "À bientôt !",
      });
      
      setIsLoggingOut(false);
      
      // ✅ REDIRECTION VERS LA PAGE D'ACCUEIL
      window.location.href = "/";
    }
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  // Obtenir le nom complet
  const getFullName = () => {
    if (!user) return "Utilisateur";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur";
  };

  // Obtenir le nom de l'entreprise
  const getCompanyName = () => {
    if (!user?.company?.name) return "Mon Entreprise";
    return user.company.name;
  };

  // ✅ Vérifier si un lien est actif
  const isLinkActive = (item: typeof navigation[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    // ✅ Pour les sous-routes, on vérifie si le pathname commence par le href
    return pathname.startsWith(item.href);
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-2 text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo - Version responsive */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <Link href="/dashboard-user" className="flex items-center gap-2">
          <Image
            src="/assets/images/Design_sans_titre.png"
            alt="Logo Vynex"
            className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1.5 shadow-md sm:h-12 sm:w-12 sm:p-2"
            width={50}
            height={50}
          />
          <span className="text-xl font-semibold text-blue-600 sm:text-2xl lg:text-3xl">
            Vynex
          </span>
        </Link>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 sm:px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isLinkActive(item);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Section aide en bas de la navigation */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <Link
            href="/dashboard-user/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span>Centre d'aide</span>
          </Link>
        </div>
      </nav>

      {/* Footer utilisateur - Version responsive */}
      <div className="border-t border-gray-200 p-2 sm:p-3">
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100 sm:gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm sm:h-9 sm:w-9 sm:text-sm">
            {getUserInitials()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
              {getFullName()}
            </p>
            <p className="truncate text-[10px] text-gray-500 sm:text-xs">
              {user?.role === "admin" ? "Administrateur" : 
               user?.role === "super_admin" ? "Super Admin" :
               user?.role === "manager" ? "Manager" :
               user?.role === "cashier" ? "Caissier" : "Employé"} - {getCompanyName()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}