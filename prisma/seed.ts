// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ============================================
// DONNÉES RÉALISTES
// ============================================

const DEFAULT_PASSWORD = "Vynex2024!";

// ============================================
// 1. ENTREPRISES
// ============================================

const companiesData = [
  {
    name: "Pizza Roma",
    email: "contact@pizzaroma.fr",
    phone: "01 23 45 67 89",
    siret: "12345678901234",
    address: "12 Rue des Pizzas",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    subscriptionPlan: "premium" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2025-01-15"),
    subscriptionEnd: new Date("2026-01-15"),
  },
  {
    name: "Boulangerie Doré",
    email: "contact@boulangeriedore.fr",
    phone: "02 34 56 78 90",
    siret: "23456789012345",
    address: "5 Rue des Baguettes",
    city: "Lyon",
    postalCode: "69001",
    country: "France",
    subscriptionPlan: "standard" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2025-03-01"),
    subscriptionEnd: new Date("2026-03-01"),
  },
  {
    name: "Coiffure Style",
    email: "contact@coiffurestyle.fr",
    phone: "03 45 67 89 01",
    siret: "34567890123456",
    address: "8 Avenue des Coiffeurs",
    city: "Marseille",
    postalCode: "13001",
    country: "France",
    subscriptionPlan: "standard" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2025-06-10"),
    subscriptionEnd: new Date("2026-06-10"),
  },
  {
    name: "Garage Auto Plus",
    email: "contact@garageautoplus.fr",
    phone: "04 56 78 90 12",
    siret: "45678901234567",
    address: "22 Rue des Mécaniciens",
    city: "Bordeaux",
    postalCode: "33000",
    country: "France",
    subscriptionPlan: "enterprise" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2024-09-01"),
    subscriptionEnd: new Date("2025-09-01"),
  },
  {
    name: "Pharmacie du Centre",
    email: "contact@pharmaciecentre.fr",
    phone: "05 67 89 01 23",
    siret: "56789012345678",
    address: "15 Place de la République",
    city: "Lille",
    postalCode: "59000",
    country: "France",
    subscriptionPlan: "premium" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2024-11-20"),
    subscriptionEnd: new Date("2025-11-20"),
  },
  {
    name: "École des Petits Génies",
    email: "contact@ecolepetitsgenies.fr",
    phone: "06 78 90 12 34",
    siret: "67890123456789",
    address: "3 Rue de l'Éducation",
    city: "Toulouse",
    postalCode: "31000",
    country: "France",
    subscriptionPlan: "free" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: true,
    trialEnd: new Date("2025-12-31"),
    logoUrl: null,
    subscriptionStart: new Date("2025-12-01"),
    subscriptionEnd: null,
  },
  {
    name: "Restaurant Le Gourmet",
    email: "contact@legourmet.fr",
    phone: "07 89 01 23 45",
    siret: "78901234567890",
    address: "42 Rue de la Gastronomie",
    city: "Nice",
    postalCode: "06000",
    country: "France",
    subscriptionPlan: "premium" as const,
    subscriptionStatus: "expired" as const,
    status: "inactive" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2024-02-01"),
    subscriptionEnd: new Date("2025-02-01"),
  },
  {
    name: "Boutique Élégance",
    email: "contact@boutiquelegance.fr",
    phone: "08 90 12 34 56",
    siret: "89012345678901",
    address: "10 Rue du Faubourg",
    city: "Strasbourg",
    postalCode: "67000",
    country: "France",
    subscriptionPlan: "standard" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2025-04-15"),
    subscriptionEnd: new Date("2026-04-15"),
  },
  {
    name: "Auto École Conduite Plus",
    email: "contact@conduiteplus.fr",
    phone: "09 01 23 45 67",
    siret: "90123456789012",
    address: "7 Boulevard de la Sécurité",
    city: "Nantes",
    postalCode: "44000",
    country: "France",
    subscriptionPlan: "free" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: true,
    trialEnd: new Date("2026-02-28"),
    logoUrl: null,
    subscriptionStart: new Date("2026-02-01"),
    subscriptionEnd: null,
  },
  {
    name: "Cabinet Médical Saint-Roch",
    email: "contact@strockmedical.fr",
    phone: "01 34 56 78 90",
    siret: "01234567890123",
    address: "25 Rue du Docteur",
    city: "Montpellier",
    postalCode: "34000",
    country: "France",
    subscriptionPlan: "premium" as const,
    subscriptionStatus: "active" as const,
    status: "active" as const,
    isTrial: false,
    logoUrl: null,
    subscriptionStart: new Date("2024-07-01"),
    subscriptionEnd: new Date("2025-07-01"),
  },
];

// ============================================
// 2. UTILISATEURS
// ============================================

const usersData: Record<string, any[]> = {
  "Pizza Roma": [
    {
      email: "marc.dupont@pizzaroma.fr",
      firstName: "Marc",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "sophie.martin@pizzaroma.fr",
      firstName: "Sophie",
      lastName: "Martin",
      phone: "06 23 45 67 89",
      role: "manager" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "pierre.durand@pizzaroma.fr",
      firstName: "Pierre",
      lastName: "Durand",
      phone: "06 34 56 78 90",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-27"),
    },
    {
      email: "julie.petit@pizzaroma.fr",
      firstName: "Julie",
      lastName: "Petit",
      phone: "06 45 67 89 01",
      role: "cashier" as const,
      status: "inactive" as const,
      emailVerified: true,
      lastLogin: new Date("2026-05-15"),
    },
    {
      email: "lucas.bernard@pizzaroma.fr",
      firstName: "Lucas",
      lastName: "Bernard",
      phone: "06 56 78 90 12",
      role: "employee" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-25"),
    },
  ],
  "Boulangerie Doré": [
    {
      email: "sophie.martin@boulangeriedore.fr",
      firstName: "Sophie",
      lastName: "Martin",
      phone: "06 67 89 01 23",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "thomas.lefevre@boulangeriedore.fr",
      firstName: "Thomas",
      lastName: "Lefevre",
      phone: "06 78 90 12 34",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "marie.dubois@boulangeriedore.fr",
      firstName: "Marie",
      lastName: "Dubois",
      phone: "06 89 01 23 45",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-27"),
    },
  ],
  "Coiffure Style": [
    {
      email: "jean.dupont@coiffurestyle.fr",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 90 12 34 56",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "emma.bernard@coiffurestyle.fr",
      firstName: "Emma",
      lastName: "Bernard",
      phone: "06 01 23 45 67",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
  ],
  "Garage Auto Plus": [
    {
      email: "pierre.durand@garageautoplus.fr",
      firstName: "Pierre",
      lastName: "Durand",
      phone: "06 12 34 56 78",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "michel.robert@garageautoplus.fr",
      firstName: "Michel",
      lastName: "Robert",
      phone: "06 23 45 67 89",
      role: "manager" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "philippe.martin@garageautoplus.fr",
      firstName: "Philippe",
      lastName: "Martin",
      phone: "06 34 56 78 90",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-27"),
    },
    {
      email: "francois.dupont@garageautoplus.fr",
      firstName: "François",
      lastName: "Dupont",
      phone: "06 45 67 89 01",
      role: "employee" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-26"),
    },
    {
      email: "alain.lefevre@garageautoplus.fr",
      firstName: "Alain",
      lastName: "Lefevre",
      phone: "06 56 78 90 12",
      role: "employee" as const,
      status: "inactive" as const,
      emailVerified: true,
      lastLogin: new Date("2026-04-15"),
    },
  ],
  "Pharmacie du Centre": [
    {
      email: "sophie.dubois@pharmaciecentre.fr",
      firstName: "Sophie",
      lastName: "Dubois",
      phone: "06 67 89 01 23",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "laurence.petit@pharmaciecentre.fr",
      firstName: "Laurence",
      lastName: "Petit",
      phone: "06 78 90 12 34",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "catherine.martin@pharmaciecentre.fr",
      firstName: "Catherine",
      lastName: "Martin",
      phone: "06 89 01 23 45",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-27"),
    },
  ],
  "École des Petits Génies": [
    {
      email: "sophie.dupont@ecolepetitsgenies.fr",
      firstName: "Sophie",
      lastName: "Dupont",
      phone: "06 90 12 34 56",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "jean.martin@ecolepetitsgenies.fr",
      firstName: "Jean",
      lastName: "Martin",
      phone: "06 01 23 45 67",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-27"),
    },
  ],
  "Restaurant Le Gourmet": [
    {
      email: "marc.lefevre@legourmet.fr",
      firstName: "Marc",
      lastName: "Lefevre",
      phone: "06 12 34 56 78",
      role: "admin" as const,
      status: "inactive" as const,
      emailVerified: true,
      lastLogin: new Date("2026-05-01"),
    },
  ],
  "Boutique Élégance": [
    {
      email: "marie.durand@boutiquelegance.fr",
      firstName: "Marie",
      lastName: "Durand",
      phone: "06 23 45 67 89",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "emma.dupont@boutiquelegance.fr",
      firstName: "Emma",
      lastName: "Dupont",
      phone: "06 34 56 78 90",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
  ],
  "Auto École Conduite Plus": [
    {
      email: "pierre.martin@conduiteplus.fr",
      firstName: "Pierre",
      lastName: "Martin",
      phone: "06 45 67 89 01",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
  ],
  "Cabinet Médical Saint-Roch": [
    {
      email: "dr.sophie.dubois@strockmedical.fr",
      firstName: "Sophie",
      lastName: "Dubois",
      phone: "06 56 78 90 12",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-29"),
    },
    {
      email: "nicolas.bernard@strockmedical.fr",
      firstName: "Nicolas",
      lastName: "Bernard",
      phone: "06 67 89 01 23",
      role: "cashier" as const,
      status: "active" as const,
      emailVerified: true,
      lastLogin: new Date("2026-06-28"),
    },
    {
      email: "claire.petit@strockmedical.fr",
      firstName: "Claire",
      lastName: "Petit",
      phone: "06 78 90 12 34",
      role: "cashier" as const,
      status: "inactive" as const,
      emailVerified: true,
      lastLogin: new Date("2026-05-20"),
    },
  ],
};

// ============================================
// 3. CLIENTS
// ============================================

const clientsData: Record<string, any[]> = {
  "Pizza Roma": [
    {
      firstName: "Jean",
      lastName: "Martin",
      email: "jean.martin@email.com",
      phone: "06 78 90 12 34",
      address: "15 Rue des Lilas",
      city: "Paris",
      postalCode: "75002",
      totalPurchases: 245.50,
      totalOrders: 12,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@email.com",
      phone: "06 89 01 23 45",
      address: "8 Avenue des Champs",
      city: "Paris",
      postalCode: "75008",
      totalPurchases: 380.00,
      totalOrders: 18,
      lastPurchase: new Date("2026-06-27"),
    },
    {
      firstName: "Lucas",
      lastName: "Bernard",
      email: "lucas.bernard@email.com",
      phone: "06 90 12 34 56",
      address: "22 Rue de la Paix",
      city: "Paris",
      postalCode: "75009",
      totalPurchases: 124.80,
      totalOrders: 6,
      lastPurchase: new Date("2026-06-25"),
    },
    {
      firstName: "Sophie",
      lastName: "Petit",
      email: "sophie.petit@email.com",
      phone: "06 01 23 45 67",
      address: "10 Rue du Commerce",
      city: "Paris",
      postalCode: "75003",
      totalPurchases: 672.30,
      totalOrders: 25,
      lastPurchase: new Date("2026-06-29"),
    },
    {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.com",
      phone: "06 12 34 56 78",
      address: "5 Rue de la Liberté",
      city: "Paris",
      postalCode: "75004",
      totalPurchases: 89.50,
      totalOrders: 4,
      lastPurchase: new Date("2026-06-20"),
    },
    {
      firstName: "Emma",
      lastName: "Lefevre",
      email: "emma.lefevre@email.com",
      phone: "06 23 45 67 89",
      address: "18 Rue de la République",
      city: "Paris",
      postalCode: "75005",
      totalPurchases: 156.20,
      totalOrders: 8,
      lastPurchase: new Date("2026-06-22"),
    },
    {
      firstName: "Thomas",
      lastName: "Robert",
      email: "thomas.robert@email.com",
      phone: "06 34 56 78 90",
      address: "25 Rue de la Gare",
      city: "Paris",
      postalCode: "75006",
      totalPurchases: 320.00,
      totalOrders: 14,
      lastPurchase: new Date("2026-06-26"),
    },
    {
      firstName: "Julie",
      lastName: "Moreau",
      email: "julie.moreau@email.com",
      phone: "06 45 67 89 01",
      address: "12 Rue du Faubourg",
      city: "Paris",
      postalCode: "75007",
      totalPurchases: 450.00,
      totalOrders: 20,
      lastPurchase: new Date("2026-06-24"),
    },
    {
      firstName: "Nicolas",
      lastName: "Simon",
      email: "nicolas.simon@email.com",
      phone: "06 56 78 90 12",
      address: "7 Rue de la Poste",
      city: "Paris",
      postalCode: "75010",
      totalPurchases: 78.30,
      totalOrders: 3,
      lastPurchase: new Date("2026-06-18"),
    },
    {
      firstName: "Catherine",
      lastName: "Michel",
      email: "catherine.michel@email.com",
      phone: "06 67 89 01 23",
      address: "30 Rue du Marché",
      city: "Paris",
      postalCode: "75011",
      totalPurchases: 210.80,
      totalOrders: 10,
      lastPurchase: new Date("2026-06-21"),
    },
  ],
  "Boulangerie Doré": [
    {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@boulangerie.com",
      phone: "06 78 90 12 34",
      address: "12 Rue de la République",
      city: "Lyon",
      postalCode: "69002",
      totalPurchases: 67.80,
      totalOrders: 15,
      lastPurchase: new Date("2026-06-29"),
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@boulangerie.com",
      phone: "06 89 01 23 45",
      address: "5 Rue des Fleurs",
      city: "Lyon",
      postalCode: "69003",
      totalPurchases: 45.30,
      totalOrders: 12,
      lastPurchase: new Date("2026-06-27"),
    },
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@boulangerie.com",
      phone: "06 90 12 34 56",
      address: "18 Rue de la Paix",
      city: "Lyon",
      postalCode: "69004",
      totalPurchases: 32.50,
      totalOrders: 8,
      lastPurchase: new Date("2026-06-25"),
    },
    {
      firstName: "Sophie",
      lastName: "Bernard",
      email: "sophie.bernard@boulangerie.com",
      phone: "06 01 23 45 67",
      address: "10 Rue du Commerce",
      city: "Lyon",
      postalCode: "69005",
      totalPurchases: 112.00,
      totalOrders: 20,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Lucas",
      lastName: "Petit",
      email: "lucas.petit@boulangerie.com",
      phone: "06 12 34 56 78",
      address: "25 Rue de la Liberté",
      city: "Lyon",
      postalCode: "69006",
      totalPurchases: 28.20,
      totalOrders: 6,
      lastPurchase: new Date("2026-06-22"),
    },
  ],
  "Coiffure Style": [
    {
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@coiffure.com",
      phone: "06 23 45 67 89",
      address: "8 Rue de la République",
      city: "Marseille",
      postalCode: "13002",
      totalPurchases: 180.50,
      totalOrders: 9,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Jean",
      lastName: "Martin",
      email: "jean.martin@coiffure.com",
      phone: "06 34 56 78 90",
      address: "15 Rue des Lilas",
      city: "Marseille",
      postalCode: "13003",
      totalPurchases: 95.00,
      totalOrders: 5,
      lastPurchase: new Date("2026-06-25"),
    },
    {
      firstName: "Sophie",
      lastName: "Durand",
      email: "sophie.durand@coiffure.com",
      phone: "06 45 67 89 01",
      address: "22 Rue de la Paix",
      city: "Marseille",
      postalCode: "13004",
      totalPurchases: 230.00,
      totalOrders: 12,
      lastPurchase: new Date("2026-06-29"),
    },
  ],
  "Garage Auto Plus": [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@garage.com",
      phone: "06 56 78 90 12",
      address: "12 Rue des Mécaniciens",
      city: "Bordeaux",
      postalCode: "33001",
      totalPurchases: 1250.00,
      totalOrders: 3,
      lastPurchase: new Date("2026-06-20"),
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@garage.com",
      phone: "06 67 89 01 23",
      address: "5 Rue de l'Automobile",
      city: "Bordeaux",
      postalCode: "33002",
      totalPurchases: 850.00,
      totalOrders: 2,
      lastPurchase: new Date("2026-06-15"),
    },
    {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@garage.com",
      phone: "06 78 90 12 34",
      address: "18 Rue des Réparations",
      city: "Bordeaux",
      postalCode: "33003",
      totalPurchases: 2300.00,
      totalOrders: 5,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Sophie",
      lastName: "Bernard",
      email: "sophie.bernard@garage.com",
      phone: "06 89 01 23 45",
      address: "10 Rue des Garages",
      city: "Bordeaux",
      postalCode: "33004",
      totalPurchases: 345.00,
      totalOrders: 1,
      lastPurchase: new Date("2026-06-10"),
    },
    {
      firstName: "Lucas",
      lastName: "Petit",
      email: "lucas.petit@garage.com",
      phone: "06 90 12 34 56",
      address: "25 Rue de la Mécanique",
      city: "Bordeaux",
      postalCode: "33005",
      totalPurchases: 1500.00,
      totalOrders: 4,
      lastPurchase: new Date("2026-06-25"),
    },
  ],
  "Pharmacie du Centre": [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@pharmacie.com",
      phone: "06 01 23 45 67",
      address: "12 Rue du Centre",
      city: "Lille",
      postalCode: "59001",
      totalPurchases: 45.50,
      totalOrders: 8,
      lastPurchase: new Date("2026-06-29"),
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@pharmacie.com",
      phone: "06 12 34 56 78",
      address: "5 Rue de la Santé",
      city: "Lille",
      postalCode: "59002",
      totalPurchases: 78.30,
      totalOrders: 12,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@pharmacie.com",
      phone: "06 23 45 67 89",
      address: "18 Rue des Médicaments",
      city: "Lille",
      postalCode: "59003",
      totalPurchases: 120.00,
      totalOrders: 15,
      lastPurchase: new Date("2026-06-27"),
    },
    {
      firstName: "Sophie",
      lastName: "Bernard",
      email: "sophie.bernard@pharmacie.com",
      phone: "06 34 56 78 90",
      address: "10 Rue du Soin",
      city: "Lille",
      postalCode: "59004",
      totalPurchases: 56.80,
      totalOrders: 10,
      lastPurchase: new Date("2026-06-26"),
    },
  ],
  "École des Petits Génies": [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@ecole.com",
      phone: "06 45 67 89 01",
      address: "12 Rue de l'École",
      city: "Toulouse",
      postalCode: "31001",
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@ecole.com",
      phone: "06 56 78 90 12",
      address: "5 Rue des Enfants",
      city: "Toulouse",
      postalCode: "31002",
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
    },
  ],
  "Restaurant Le Gourmet": [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@legourmet.com",
      phone: "06 67 89 01 23",
      address: "12 Rue de la Gastronomie",
      city: "Nice",
      postalCode: "06001",
      totalPurchases: 450.00,
      totalOrders: 8,
      lastPurchase: new Date("2026-05-01"),
    },
  ],
  "Boutique Élégance": [
    {
      firstName: "Sophie",
      lastName: "Dubois",
      email: "sophie.dubois@boutique.com",
      phone: "06 78 90 12 34",
      address: "10 Rue du Faubourg",
      city: "Strasbourg",
      postalCode: "67001",
      totalPurchases: 320.00,
      totalOrders: 6,
      lastPurchase: new Date("2026-06-28"),
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@boutique.com",
      phone: "06 89 01 23 45",
      address: "5 Rue de la Mode",
      city: "Strasbourg",
      postalCode: "67002",
      totalPurchases: 180.50,
      totalOrders: 4,
      lastPurchase: new Date("2026-06-25"),
    },
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@boutique.com",
      phone: "06 90 12 34 56",
      address: "18 Rue du Luxe",
      city: "Strasbourg",
      postalCode: "67003",
      totalPurchases: 450.00,
      totalOrders: 8,
      lastPurchase: new Date("2026-06-29"),
    },
  ],
  "Auto École Conduite Plus": [
    {
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@conduite.com",
      phone: "06 01 23 45 67",
      address: "12 Rue de la Conduite",
      city: "Nantes",
      postalCode: "44001",
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
    },
  ],
  "Cabinet Médical Saint-Roch": [
    {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@medical.com",
      phone: "06 12 34 56 78",
      address: "12 Rue du Docteur",
      city: "Montpellier",
      postalCode: "34001",
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@medical.com",
      phone: "06 23 45 67 89",
      address: "5 Rue de la Santé",
      city: "Montpellier",
      postalCode: "34002",
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
    },
  ],
};

// ============================================
// 4. PRODUITS
// ============================================

const productsData: Record<string, any[]> = {
  "Pizza Roma": [
    {
      name: "Pizza Margherita",
      reference: "PIZ-001",
      description: "Sauce tomate, mozzarella, basilic frais",
      purchasePrice: 5.50,
      salePrice: 12.50,
      taxRate: 20,
      stockQuantity: 45,
      stockMin: 10,
      category: "Pizzas",
      subcategory: "Classiques",
      unit: "unité",
    },
    {
      name: "Pizza Pepperoni",
      reference: "PIZ-002",
      description: "Sauce tomate, mozzarella, pepperoni",
      purchasePrice: 6.00,
      salePrice: 14.50,
      taxRate: 20,
      stockQuantity: 28,
      stockMin: 8,
      category: "Pizzas",
      subcategory: "Classiques",
      unit: "unité",
    },
    {
      name: "Pizza 4 Fromages",
      reference: "PIZ-003",
      description: "Sauce tomate, mozzarella, chèvre, roquefort, parmesan",
      purchasePrice: 6.50,
      salePrice: 16.00,
      taxRate: 20,
      stockQuantity: 18,
      stockMin: 5,
      category: "Pizzas",
      subcategory: "Spéciales",
      unit: "unité",
    },
    {
      name: "Pizza Végétarienne",
      reference: "PIZ-004",
      description: "Sauce tomate, mozzarella, légumes grillés",
      purchasePrice: 6.20,
      salePrice: 15.00,
      taxRate: 20,
      stockQuantity: 22,
      stockMin: 5,
      category: "Pizzas",
      subcategory: "Végétariennes",
      unit: "unité",
    },
    {
      name: "Pizza Hawaïenne",
      reference: "PIZ-005",
      description: "Sauce tomate, mozzarella, jambon, ananas",
      purchasePrice: 6.30,
      salePrice: 15.50,
      taxRate: 20,
      stockQuantity: 15,
      stockMin: 4,
      category: "Pizzas",
      subcategory: "Spéciales",
      unit: "unité",
    },
    {
      name: "Coca-Cola 33cl",
      reference: "BOI-001",
      description: "Boisson gazeuse",
      purchasePrice: 1.20,
      salePrice: 2.50,
      taxRate: 20,
      stockQuantity: 85,
      stockMin: 20,
      category: "Boissons",
      unit: "bouteille",
    },
    {
      name: "Coca-Cola Zero 33cl",
      reference: "BOI-002",
      description: "Boisson gazeuse sans sucre",
      purchasePrice: 1.20,
      salePrice: 2.50,
      taxRate: 20,
      stockQuantity: 60,
      stockMin: 15,
      category: "Boissons",
      unit: "bouteille",
    },
    {
      name: "Eau minérale 50cl",
      reference: "BOI-003",
      description: "Eau plate",
      purchasePrice: 0.80,
      salePrice: 1.50,
      taxRate: 20,
      stockQuantity: 120,
      stockMin: 30,
      category: "Boissons",
      unit: "bouteille",
    },
    {
      name: "Tiramisu",
      reference: "DES-001",
      description: "Dessert italien au café",
      purchasePrice: 2.50,
      salePrice: 6.50,
      taxRate: 20,
      stockQuantity: 15,
      stockMin: 3,
      category: "Desserts",
      unit: "portion",
    },
    {
      name: "Panna Cotta",
      reference: "DES-002",
      description: "Dessert italien à la vanille",
      purchasePrice: 2.30,
      salePrice: 6.00,
      taxRate: 20,
      stockQuantity: 12,
      stockMin: 3,
      category: "Desserts",
      unit: "portion",
    },
  ],
  "Boulangerie Doré": [
    {
      name: "Baguette Tradition",
      reference: "BAG-001",
      description: "Baguette de tradition française",
      purchasePrice: 0.80,
      salePrice: 1.20,
      taxRate: 10,
      stockQuantity: 120,
      stockMin: 30,
      category: "Pains",
      unit: "pièce",
    },
    {
      name: "Baguette Blanche",
      reference: "BAG-002",
      description: "Baguette blanche classique",
      purchasePrice: 0.70,
      salePrice: 1.00,
      taxRate: 10,
      stockQuantity: 100,
      stockMin: 25,
      category: "Pains",
      unit: "pièce",
    },
    {
      name: "Pain de Campagne",
      reference: "BAG-003",
      description: "Pain de campagne, farine complète",
      purchasePrice: 1.20,
      salePrice: 2.50,
      taxRate: 10,
      stockQuantity: 40,
      stockMin: 10,
      category: "Pains",
      unit: "pièce",
    },
    {
      name: "Croissant",
      reference: "PAT-001",
      description: "Croissant au beurre",
      purchasePrice: 0.60,
      salePrice: 1.10,
      taxRate: 10,
      stockQuantity: 70,
      stockMin: 15,
      category: "Viennoiseries",
      unit: "pièce",
    },
    {
      name: "Pain au Chocolat",
      reference: "PAT-002",
      description: "Pain au chocolat",
      purchasePrice: 0.65,
      salePrice: 1.20,
      taxRate: 10,
      stockQuantity: 55,
      stockMin: 10,
      category: "Viennoiseries",
      unit: "pièce",
    },
    {
      name: "Pain aux Raisins",
      reference: "PAT-003",
      description: "Pain aux raisins",
      purchasePrice: 0.70,
      salePrice: 1.30,
      taxRate: 10,
      stockQuantity: 30,
      stockMin: 5,
      category: "Viennoiseries",
      unit: "pièce",
    },
    {
      name: "Tarte aux Fraises",
      reference: "TAR-001",
      description: "Tarte aux fraises, crème pâtissière",
      purchasePrice: 3.00,
      salePrice: 4.50,
      taxRate: 10,
      stockQuantity: 8,
      stockMin: 2,
      category: "Pâtisseries",
      unit: "pièce",
    },
  ],
  "Coiffure Style": [
    {
      name: "Coupe Homme",
      reference: "SRV-001",
      description: "Coupe homme classique",
      purchasePrice: 0,
      salePrice: 25.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
    {
      name: "Coupe Femme",
      reference: "SRV-002",
      description: "Coupe femme",
      purchasePrice: 0,
      salePrice: 35.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
    {
      name: "Coloration",
      reference: "SRV-003",
      description: "Coloration complète",
      purchasePrice: 10.00,
      salePrice: 55.00,
      taxRate: 20,
      stockQuantity: 20,
      stockMin: 5,
      category: "Services",
      unit: "service",
    },
    {
      name: "Brushing",
      reference: "SRV-004",
      description: "Brushing et coiffage",
      purchasePrice: 0,
      salePrice: 20.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
  ],
  "Garage Auto Plus": [
    {
      name: "Pneu Michelin 205/55R16",
      reference: "PNE-001",
      description: "Pneu été, dimension 205/55R16",
      purchasePrice: 45.00,
      salePrice: 75.00,
      taxRate: 20,
      stockQuantity: 12,
      stockMin: 4,
      category: "Pneus",
      unit: "pièce",
    },
    {
      name: "Pneu Michelin 195/65R15",
      reference: "PNE-002",
      description: "Pneu été, dimension 195/65R15",
      purchasePrice: 40.00,
      salePrice: 65.00,
      taxRate: 20,
      stockQuantity: 8,
      stockMin: 3,
      category: "Pneus",
      unit: "pièce",
    },
    {
      name: "Huile Moteur 5W30",
      reference: "HUI-001",
      description: "Huile moteur synthétique 5W30, 5L",
      purchasePrice: 25.00,
      salePrice: 45.00,
      taxRate: 20,
      stockQuantity: 15,
      stockMin: 5,
      category: "Lubrifiants",
      unit: "bidon",
    },
    {
      name: "Batterie 12V 60Ah",
      reference: "BAT-001",
      description: "Batterie de démarrage 12V 60Ah",
      purchasePrice: 60.00,
      salePrice: 95.00,
      taxRate: 20,
      stockQuantity: 6,
      stockMin: 2,
      category: "Électricité",
      unit: "pièce",
    },
    {
      name: "Plaquettes de Frein Avant",
      reference: "FRE-001",
      description: "Jeu de plaquettes de frein avant",
      purchasePrice: 25.00,
      salePrice: 45.00,
      taxRate: 20,
      stockQuantity: 10,
      stockMin: 3,
      category: "Freinage",
      unit: "jeu",
    },
    {
      name: "Filtre à Huile",
      reference: "FIL-001",
      description: "Filtre à huile standard",
      purchasePrice: 8.00,
      salePrice: 15.00,
      taxRate: 20,
      stockQuantity: 20,
      stockMin: 5,
      category: "Filtres",
      unit: "pièce",
    },
  ],
  "Pharmacie du Centre": [
    {
      name: "Paracétamol 500mg",
      reference: "MED-001",
      description: "Comprimé de paracétamol 500mg, boîte de 20",
      purchasePrice: 2.00,
      salePrice: 4.50,
      taxRate: 10,
      stockQuantity: 50,
      stockMin: 10,
      category: "Médicaments",
      unit: "boîte",
    },
    {
      name: "Ibuprofène 400mg",
      reference: "MED-002",
      description: "Comprimé d'ibuprofène 400mg, boîte de 15",
      purchasePrice: 3.00,
      salePrice: 6.80,
      taxRate: 10,
      stockQuantity: 35,
      stockMin: 8,
      category: "Médicaments",
      unit: "boîte",
    },
    {
      name: "Amoxicilline 500mg",
      reference: "MED-003",
      description: "Gélule d'amoxicilline 500mg, boîte de 12",
      purchasePrice: 4.00,
      salePrice: 9.50,
      taxRate: 10,
      stockQuantity: 20,
      stockMin: 5,
      category: "Médicaments",
      unit: "boîte",
    },
    {
      name: "Vitamine C 500mg",
      reference: "VIT-001",
      description: "Comprimé de vitamine C 500mg, boîte de 20",
      purchasePrice: 3.50,
      salePrice: 7.90,
      taxRate: 10,
      stockQuantity: 25,
      stockMin: 5,
      category: "Vitamines",
      unit: "boîte",
    },
  ],
  "École des Petits Génies": [
    {
      name: "Cahier A4 96 pages",
      reference: "CAH-001",
      description: "Cahier A4, 96 pages, couverture cartonnée",
      purchasePrice: 2.50,
      salePrice: 4.50,
      taxRate: 10,
      stockQuantity: 50,
      stockMin: 10,
      category: "Fournitures",
      unit: "pièce",
    },
    {
      name: "Stylo Bic Bleu",
      reference: "STY-001",
      description: "Stylo Bic bleu, boîte de 10",
      purchasePrice: 1.00,
      salePrice: 2.50,
      taxRate: 10,
      stockQuantity: 30,
      stockMin: 5,
      category: "Fournitures",
      unit: "boîte",
    },
    {
      name: "Gomme",
      reference: "GOM-001",
      description: "Gomme blanche",
      purchasePrice: 0.50,
      salePrice: 1.20,
      taxRate: 10,
      stockQuantity: 20,
      stockMin: 5,
      category: "Fournitures",
      unit: "pièce",
    },
  ],
  "Restaurant Le Gourmet": [
    {
      name: "Menu Dégustation",
      reference: "MEN-001",
      description: "Menu dégustation 5 plats",
      purchasePrice: 15.00,
      salePrice: 45.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
    {
      name: "Menu Gastronomique",
      reference: "MEN-002",
      description: "Menu gastronomique 7 plats",
      purchasePrice: 25.00,
      salePrice: 75.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
  ],
  "Boutique Élégance": [
    {
      name: "Robe Cérémonie",
      reference: "VET-001",
      description: "Robe de cérémonie en soie",
      purchasePrice: 60.00,
      salePrice: 150.00,
      taxRate: 20,
      stockQuantity: 8,
      stockMin: 2,
      category: "Vêtements",
      unit: "pièce",
    },
    {
      name: "Costume Homme",
      reference: "VET-002",
      description: "Costume homme 2 pièces",
      purchasePrice: 100.00,
      salePrice: 250.00,
      taxRate: 20,
      stockQuantity: 5,
      stockMin: 1,
      category: "Vêtements",
      unit: "pièce",
    },
    {
      name: "Chemise Homme",
      reference: "VET-003",
      description: "Chemise homme en coton",
      purchasePrice: 25.00,
      salePrice: 55.00,
      taxRate: 20,
      stockQuantity: 12,
      stockMin: 3,
      category: "Vêtements",
      unit: "pièce",
    },
  ],
  "Auto École Conduite Plus": [
    {
      name: "Leçon de Conduite 1h",
      reference: "LES-001",
      description: "Leçon de conduite 1h",
      purchasePrice: 0,
      salePrice: 45.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "heure",
    },
    {
      name: "Pack 10 Heures",
      reference: "PKG-001",
      description: "Pack de 10 leçons de conduite",
      purchasePrice: 0,
      salePrice: 400.00,
      taxRate: 20,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "pack",
    },
  ],
  "Cabinet Médical Saint-Roch": [
    {
      name: "Consultation Générale",
      reference: "CON-001",
      description: "Consultation médicale générale",
      purchasePrice: 0,
      salePrice: 25.00,
      taxRate: 10,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
    {
      name: "Consultation Spécialisée",
      reference: "CON-002",
      description: "Consultation médicale spécialisée",
      purchasePrice: 0,
      salePrice: 45.00,
      taxRate: 10,
      stockQuantity: 0,
      stockMin: 0,
      category: "Services",
      unit: "service",
    },
  ],
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

async function hashPassword(password: string) {
  return hash(password, 10);
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateInvoiceNumber(prefix: string, index: number) {
  return `${prefix}${String(index).padStart(4, "0")}`;
}

// ✅ Fonction pour générer une référence unique
function generateSaleReference(prefix: string, index: number) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}-${String(index).padStart(4, "0")}`;
}

// ✅ Convertir en nombre de manière sûre
function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function main() {
  console.log("🌱 Début du peuplement de la base de données...\n");

  try {
    // Nettoyer la base
    console.log("🧹 Nettoyage des données existantes...");
    await prisma.$transaction([
      prisma.refreshToken.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.stockMovement.deleteMany(),
      prisma.saleItem.deleteMany(),
      prisma.sale.deleteMany(),
      prisma.invoice.deleteMany(),
      prisma.product.deleteMany(),
      prisma.client.deleteMany(),
      prisma.user.deleteMany(),
      prisma.settings.deleteMany(),
      prisma.company.deleteMany(),
    ]);
    console.log("✅ Nettoyage terminé\n");

    const companies: any[] = [];

    // 1. Créer les entreprises
    for (const companyData of companiesData) {
      const company = await prisma.company.create({
        data: {
          ...companyData,
          settings: {
            create: {
              currency: "EUR",
              taxDefault: 20,
              invoicePrefix: "FACT-",
              invoiceNextNumber: 1,
            },
          },
        },
      });
      companies.push({ ...company, name: companyData.name });
      console.log(`✅ Entreprise créée: ${company.name}`);
    }

    console.log("\n");

    // 2. Créer les utilisateurs, clients, produits pour chaque entreprise
    for (const company of companies) {
      const companyName = company.name;

      // 2.1 Utilisateurs
      const companyUsers = usersData[companyName] || [];
      for (const userData of companyUsers) {
        await prisma.user.create({
          data: {
            ...userData,
            companyId: company.id,
            password: await hashPassword(DEFAULT_PASSWORD),
            phone: userData.phone || null,
            verificationToken: null,
            resetToken: null,
            resetTokenExpires: null,
            lockedUntil: null,
            loginAttempts: 0,
          },
        });
      }
      console.log(`✅ ${companyUsers.length} utilisateurs créés pour ${companyName}`);

      // 2.2 Clients
      const companyClients = clientsData[companyName] || [];
      for (const clientData of companyClients) {
        await prisma.client.create({
          data: {
            ...clientData,
            companyId: company.id,
            country: "France",
            status: "active",
            tags: [],
          },
        });
      }
      console.log(`✅ ${companyClients.length} clients créés pour ${companyName}`);

      // 2.3 Produits
      const companyProducts = productsData[companyName] || [];
      for (const productData of companyProducts) {
        await prisma.product.create({
          data: {
            ...productData,
            companyId: company.id,
            status: productData.stockQuantity > 0 ? "active" : "out_of_stock",
          },
        });
      }
      console.log(`✅ ${companyProducts.length} produits créés pour ${companyName}`);

      console.log("");
    }

    // ============================================
    // 3. CRÉER LES VENTES POUR PIZZA ROMA
    // ============================================

    const pizzaRoma = companies.find((c) => c.name === "Pizza Roma");
    if (pizzaRoma) {
      const clients = await prisma.client.findMany({
        where: { companyId: pizzaRoma.id },
      });
      const products = await prisma.product.findMany({
        where: { companyId: pizzaRoma.id },
      });
      const users = await prisma.user.findMany({
        where: { companyId: pizzaRoma.id },
      });
      const admin = users.find((u) => u.role === "admin");

      if (clients.length > 0 && products.length > 0 && admin) {
        const salesToCreate = 150;
        const startDate = new Date("2025-06-01");
        const endDate = new Date();

        console.log(`📊 Création de ${salesToCreate} ventes pour Pizza Roma...`);

        for (let i = 0; i < salesToCreate; i++) {
          const randomClient = clients[Math.floor(Math.random() * clients.length)];
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const saleDate = randomDate(startDate, endDate);
          const numItems = 1 + Math.floor(Math.random() * 4);
          const selectedProducts = products.slice(0, numItems).map(() => 
            products[Math.floor(Math.random() * products.length)]
          );

          let subtotal = 0;
          const saleItems = selectedProducts.map((p) => {
            const qty = 1 + Math.floor(Math.random() * 3);
            const total = p.salePrice * qty;
            subtotal += total;
            return {
              productId: p.id,
              productName: p.name,
              productReference: p.reference,
              quantity: qty,
              unitPrice: p.salePrice,
              discountAmount: 0,
              total,
            };
          });

          // Appliquer parfois une remise
          let discountAmount = 0;
          if (Math.random() > 0.7) {
            discountAmount = subtotal * 0.1;
          }

          const taxAmount = (subtotal - discountAmount) * 0.2;
          const total = subtotal - discountAmount + taxAmount;

          // Statuts aléatoires
          const statuses: ("completed" | "canceled" | "refunded")[] = ["completed", "completed", "completed", "completed", "canceled"];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const paymentStatuses: ("paid" | "pending" | "refunded")[] = ["paid", "paid", "paid", "pending"];
          const paymentStatus = status === "canceled" ? "refunded" : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
          const paymentMethods: ("cash" | "card" | "mobile_payment" | "transfer")[] = ["cash", "card", "mobile_payment", "card", "card"];
          const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

          // ✅ Référence UNIQUE
          const reference = generateSaleReference("PR", i);

          const sale = await prisma.sale.create({
            data: {
              companyId: pizzaRoma.id,
              clientId: randomClient.id,
              userId: randomUser.id,
              reference,
              saleDate,
              subtotal,
              discountAmount,
              taxAmount,
              total,
              paymentMethod,
              paymentStatus: paymentStatus as any,
              paymentDate: status === "completed" ? saleDate : null,
              status: status as any,
              notes: Math.random() > 0.8 ? "Commande spéciale" : null,
              saleItems: {
                create: saleItems,
              },
            },
          });

          // Mettre à jour le stock
          for (const item of saleItems) {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
            });
            if (product && status === "completed") {
              const beforeStock = product.stockQuantity;
              const afterStock = Math.max(0, beforeStock - item.quantity);
              await prisma.product.update({
                where: { id: product.id },
                data: { stockQuantity: afterStock },
              });
              await prisma.stockMovement.create({
                data: {
                  productId: product.id,
                  userId: admin.id,
                  saleId: sale.id,
                  quantity: -item.quantity,
                  type: "sale",
                  beforeStock,
                  afterStock,
                  reason: "Vente",
                },
              });
            }
          }

          // Créer une facture pour les ventes complétées
          if (status === "completed" && i % 2 === 0) {
            const settings = await prisma.settings.findUnique({
              where: { companyId: pizzaRoma.id },
            });
            const nextNumber = settings?.invoiceNextNumber || 1;
            const invoiceNumber = generateInvoiceNumber("FACT-", nextNumber);

            const invoiceStatuses: ("paid" | "sent" | "overdue")[] = ["paid", "paid", "sent", "overdue"];
            const invoiceStatus = paymentStatus === "paid" ? "paid" : invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];

            await prisma.invoice.create({
              data: {
                companyId: pizzaRoma.id,
                clientId: randomClient.id,
                saleId: sale.id,
                invoiceNumber,
                invoiceDate: saleDate,
                dueDate: new Date(saleDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                subtotal,
                taxAmount,
                total,
                status: invoiceStatus as any,
                sentAt: status === "completed" ? saleDate : null,
                paidAt: invoiceStatus === "paid" ? saleDate : null,
                footerText: "Merci de votre confiance",
              },
            });

            await prisma.settings.update({
              where: { companyId: pizzaRoma.id },
              data: { invoiceNextNumber: nextNumber + 1 },
            });
          }
        }

        console.log(`✅ ${salesToCreate} ventes créées pour Pizza Roma avec leurs factures et mouvements de stock\n`);
      }
    }

    // ============================================
    // 4. CRÉER LES VENTES POUR BOULANGERIE DORÉ
    // ============================================

    const boulangerie = companies.find((c) => c.name === "Boulangerie Doré");
    if (boulangerie) {
      const clients = await prisma.client.findMany({
        where: { companyId: boulangerie.id },
      });
      const products = await prisma.product.findMany({
        where: { companyId: boulangerie.id },
      });
      const users = await prisma.user.findMany({
        where: { companyId: boulangerie.id },
      });
      const admin = users.find((u) => u.role === "admin");

      if (clients.length > 0 && products.length > 0 && admin) {
        const salesToCreate = 80;
        console.log(`📊 Création de ${salesToCreate} ventes pour Boulangerie Doré...`);

        for (let i = 0; i < salesToCreate; i++) {
          const randomClient = clients[Math.floor(Math.random() * clients.length)];
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const saleDate = randomDate(new Date("2025-06-01"), new Date());
          const numItems = 1 + Math.floor(Math.random() * 2);
          const selectedProducts = products.slice(0, numItems).map(() => 
            products[Math.floor(Math.random() * products.length)]
          );

          let subtotal = 0;
          const saleItems = selectedProducts.map((p) => {
            const qty = 1 + Math.floor(Math.random() * 3);
            const total = p.salePrice * qty;
            subtotal += total;
            return {
              productId: p.id,
              productName: p.name,
              productReference: p.reference,
              quantity: qty,
              unitPrice: p.salePrice,
              discountAmount: 0,
              total,
            };
          });

          const taxAmount = subtotal * 0.1;
          const total = subtotal + taxAmount;

          const statuses: ("completed" | "canceled")[] = ["completed", "completed", "completed", "canceled"];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          // ✅ Référence UNIQUE
          const reference = generateSaleReference("BD", i);

          await prisma.sale.create({
            data: {
              companyId: boulangerie.id,
              clientId: randomClient.id,
              userId: randomUser.id,
              reference,
              saleDate,
              subtotal,
              taxAmount,
              total,
              paymentMethod: "cash",
              paymentStatus: status === "completed" ? "paid" : "pending",
              paymentDate: status === "completed" ? saleDate : null,
              status: status as any,
              saleItems: {
                create: saleItems,
              },
            },
          });
        }

        console.log(`✅ ${salesToCreate} ventes créées pour Boulangerie Doré\n`);
      }
    }

    // ============================================
    // 5. RÉSULTAT FINAL
    // ============================================

    console.log("🎉 Peuplement terminé avec succès !");
    console.log("\n📋 RÉSUMÉ DES DONNÉES CRÉÉES :");
    console.log(`   - ${companiesData.length} entreprises`);
    
    for (const company of companies) {
      const userCount = await prisma.user.count({ where: { companyId: company.id } });
      const clientCount = await prisma.client.count({ where: { companyId: company.id } });
      const productCount = await prisma.product.count({ where: { companyId: company.id } });
      const saleCount = await prisma.sale.count({ where: { companyId: company.id } });
      const invoiceCount = await prisma.invoice.count({ where: { companyId: company.id } });
      
      console.log(`   \n   📌 ${company.name}:`);
      console.log(`      - ${userCount} utilisateurs`);
      console.log(`      - ${clientCount} clients`);
      console.log(`      - ${productCount} produits`);
      console.log(`      - ${saleCount} ventes`);
      console.log(`      - ${invoiceCount} factures`);
    }

    console.log("\n🔑 INFORMATIONS DE CONNEXION :");
    console.log("   Email: marc.dupont@pizzaroma.fr");
    console.log("   Mot de passe: Vynex2024!");
    console.log("\n   Email: sophie.martin@boulangeriedore.fr");
    console.log("   Mot de passe: Vynex2024!");

  } catch (error) {
    console.error("❌ Erreur lors du peuplement:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();