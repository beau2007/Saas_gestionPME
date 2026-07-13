// src/components/landing/Footer.tsx
"use client";

import Link from "next/link";
import { 
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import Image from "next/image";

const footerLinks = {
  produit: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Intégrations", href: "/integrations" },
    { name: "Mises à jour", href: "/changelog" },
  ],
  entreprise: [
    { name: "À propos", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Carrières", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Centre d'aide", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "API", href: "/api-docs" },
    { name: "Statut", href: "/status" },
  ],
  legal: [
    { name: "Confidentialité", href: "/privacy" },
    { name: "Conditions", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
    { name: "RGPD", href: "/rgpd" },
  ],
};


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/assets/images/Design_sans_titre.png"
                  alt="Logo Vynex"
                  className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-md"
                  width={50}
                  height={50}
                />
                <span className="text-3xl font-semibold text-blue-600">Vynex</span>
            </Link>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@vynex.com">contact@vynex.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+237657541547">+237 657 541 547</a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white">Produit</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.produit.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Entreprise</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Légal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">
            © {currentYear} Vynex. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}