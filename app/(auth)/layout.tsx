// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vynex - Gestion pour petites entreprises",
  description: "Gérez votre stock, vos factures, vos ventes et vos clients en un seul endroit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
        </div>

  );
}