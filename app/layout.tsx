// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vynex - Gestion pour petites entreprises",
  description: "Gérez votre stock, vos factures, vos ventes et vos clients en un seul endroit. Solution tout-en-un pour restaurants, commerces et PME.",
  keywords: "SaaS, gestion d'entreprise, stock, facturation, ventes, clients",
  openGraph: {
    title: "Vynex - Gestion pour petites entreprises",
    description: "La solution tout-en-un pour gérer votre entreprise",
    type: "website",
    url: "https://vynex.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
        />
      </body>
    </html>
  );
}