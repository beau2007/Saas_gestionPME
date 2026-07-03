// app/(dashboard)/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    // Vérifier l'authentification
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // ✅ Vérifier si on est sur mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Sur desktop, la sidebar est ouverte par défaut
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  // ✅ Gérer l'ouverture/fermeture de la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Gérer le bouton menu (mobile)
  const handleMenuClick = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Si pas encore monté
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-gray-400">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ✅ Sidebar Desktop - toujours visible sur grand écran */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Sidebar />
      </aside>

      {/* ✅ Overlay pour mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ✅ Contenu principal */}
      <div
        className={`flex flex-col transition-all duration-300 min-h-screen ${
          isSidebarOpen && !isMobile ? "lg:ml-64" : ""
        }`}
      >
        <Header onMenuClick={handleMenuClick} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}