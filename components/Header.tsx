// components/dashboard/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Loader2,
  Moon,
  Sun,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick: () => void;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  company?: {
    id: string;
    name: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
  } | null;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifications] = useState([
    { id: "1", title: "Nouvelle vente", description: "Vente #1234 de 45.50€", time: "Il y a 5 minutes", read: false },
    { id: "2", title: "Stock faible", description: "Pizza Pepperoni - plus que 3 unités", time: "Il y a 15 minutes", read: false },
    { id: "3", title: "Facture payée", description: "Facture #FACT-2026-0042", time: "Il y a 1 heure", read: true },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setIsLoading(true);
    const loadUserData = () => {
      try {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          setUser(parsed);
        }
      } catch (error) {
        console.error("❌ Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  const getFullName = () => {
    if (!user) return "Utilisateur";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur";
  };

  const getRoleLabel = () => {
    if (!user) return "Utilisateur";
    const roles: Record<string, string> = {
      super_admin: "Super Admin",
      admin: "Administrateur",
      manager: "Manager",
      cashier: "Caissier",
      employee: "Employé",
    };
    return roles[user.role] || user.role;
  };

  const getCompanyName = () => {
    if (!user?.company?.name) return "Mon Entreprise";
    return user.company.name;
  };

  // ✅ DÉCONNEXION - VERSION CORRIGÉE
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("token");
      
      // ✅ Appeler l'API de déconnexion
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
      console.error("Erreur lors de la déconnexion API:", error);
    } finally {
      // ✅ Nettoyer le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      
      // ✅ Nettoyer les cookies
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // ✅ Afficher un message de succès
      toast.success("Déconnexion réussie", { 
        description: "À bientôt !",
        duration: 3000,
      });
      
      setIsLoggingOut(false);
      setShowProfileMenu(false);
      
      // ✅ REDIRECTION FORCÉE VERS LA PAGE D'ACCUEIL
      // Utiliser window.location.href pour une redirection complète
      window.location.href = "/";
      
      // Alternative si window.location ne fonctionne pas :
      // router.push("/");
      // router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-slate-900/95">
      <div className="flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Gauche */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-green-600 dark:text-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
              {getCompanyName()}
            </h1>
              {user?.company && (
                  <p className="text-lg font-bold text-blue-700">
                    {user.company.subscriptionPlan === "free" ? "Offre gratuite" : `Abonnement ${user.company.subscriptionPlan}`}
                  </p>
              )}
          </div>
          
          <div className="block sm:hidden">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Recherche - Desktop */}
        <div className="hidden flex-1 max-w-md px-2 md:block lg:px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="h-9 w-full rounded-lg border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:bg-white dark:border-gray-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Droite */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Thème */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white sm:flex"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-[16px] bg-red-500 px-1 text-[9px] font-medium text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-slate-900 sm:w-80">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Tout marquer comme lu
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`cursor-pointer px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                        !notif.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notif.description}
                      </p>
                      <p className="text-[10px] text-gray-400">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 px-4 py-2 text-center dark:border-gray-800">
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profil */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1 rounded-lg px-1.5 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 sm:px-2 sm:py-1.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex h-8 w-8 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm sm:h-8 sm:w-8 sm:text-sm">
                    {getInitials()}
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline-block">
                    {getFullName()}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
                </>
              )}
            </button>

            {showProfileMenu && !isLoading && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-slate-900">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getFullName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRoleLabel()}
                    {getCompanyName() && ` - ${getCompanyName()}`}
                  </p>
                </div>
                <hr className="my-1 border-gray-100 dark:border-gray-800" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/dashboard-user/profile");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Mon profil
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/dashboard-user/settings");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Paramètres
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/dashboard-user/help");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  Centre d'aide
                </button>
                <hr className="my-1 border-gray-100 dark:border-gray-800" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recherche - Mobile */}
      <div className="border-t border-gray-100 px-3 py-2 dark:border-gray-800 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="h-9 w-full rounded-lg border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder:text-gray-400 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
    </header>
  );
}