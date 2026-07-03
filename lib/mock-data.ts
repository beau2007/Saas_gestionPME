// lib/mock-data.ts
export const employees = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie@example.com",
    phone: "06 12 34 56 78",
    role: "admin" as const,
    status: "active" as const,
    joinedDate: "15 Jan 2026",
    avatar: "SM",
    color: "bg-blue-500",
    lastActive: "Il y a 2h",
  },
  {
    id: 2,
    name: "Pierre Durand",
    email: "pierre@example.com",
    phone: "06 23 45 67 89",
    role: "manager" as const,
    status: "active" as const,
    joinedDate: "3 Fév 2026",
    avatar: "PD",
    color: "bg-green-500",
    lastActive: "Il y a 5h",
  },
  {
    id: 3,
    name: "Julie Petit",
    email: "julie@example.com",
    phone: "06 34 56 78 90",
    role: "cashier" as const,
    status: "active" as const,
    joinedDate: "20 Mar 2026",
    avatar: "JP",
    color: "bg-purple-500",
    lastActive: "Il y a 1j",
  },
  {
    id: 4,
    name: "Marc Lefevre",
    email: "marc@example.com",
    phone: "06 45 67 89 01",
    role: "cashier" as const,
    status: "inactive" as const,
    joinedDate: "5 Avr 2026",
    avatar: "ML",
    color: "bg-orange-500",
    lastActive: "Il y a 3j",
  },
  {
    id: 5,
    name: "Emma Bernard",
    email: "emma@example.com",
    phone: "06 56 78 90 12",
    role: "employee" as const,
    status: "pending" as const,
    joinedDate: "12 Mai 2026",
    avatar: "EB",
    color: "bg-pink-500",
    lastActive: "En attente",
  },
];

export const roleColors = {
  admin: "bg-red-100 text-red-700",
  manager: "bg-blue-100 text-blue-700",
  cashier: "bg-green-100 text-green-700",
  employee: "bg-gray-100 text-gray-700",
};

export const roleLabels = {
  admin: "Administrateur",
  manager: "Manager",
  cashier: "Caissier",
  employee: "Employé",
};

export const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};


// lib/mock-data.ts - Ajout à la fin du fichier

export const invoices = [
  {
    id: 1,
    number: "FACT-2026-0042",
    clientName: "Jean Dupont",
    clientEmail: "jean.dupont@email.com",
    amount: 45.50,
    tax: 9.10,
    total: 54.60,
    status: "paid" as const,
    date: "15 Juin 2026",
    dueDate: "15 Juillet 2026",
    items: [
      { name: "Pizza Margherita", quantity: 2, price: 12.50 },
      { name: "Coca-Cola", quantity: 2, price: 2.50 },
    ],
  },
  {
    id: 2,
    number: "FACT-2026-0043",
    clientName: "Sophie Martin",
    clientEmail: "sophie@email.com",
    amount: 89.00,
    tax: 17.80,
    total: 106.80,
    status: "sent" as const,
    date: "18 Juin 2026",
    dueDate: "18 Juillet 2026",
    items: [
      { name: "Pizza Pepperoni", quantity: 3, price: 14.50 },
      { name: "Tiramisu", quantity: 2, price: 6.50 },
      { name: "Eau minérale", quantity: 3, price: 2.00 },
    ],
  },
  {
    id: 3,
    number: "FACT-2026-0044",
    clientName: "Pierre Durand",
    clientEmail: "pierre@email.com",
    amount: 22.00,
    tax: 4.40,
    total: 26.40,
    status: "overdue" as const,
    date: "1 Juin 2026",
    dueDate: "1 Juillet 2026",
    items: [
      { name: "Salade César", quantity: 1, price: 12.00 },
      { name: "Jus d'orange", quantity: 2, price: 5.00 },
    ],
  },
  {
    id: 4,
    number: "FACT-2026-0045",
    clientName: "Marie Bernard",
    clientEmail: "marie@email.com",
    amount: 78.00,
    tax: 15.60,
    total: 93.60,
    status: "paid" as const,
    date: "20 Juin 2026",
    dueDate: "20 Juillet 2026",
    items: [
      { name: "Pizza 4 Fromages", quantity: 2, price: 16.00 },
      { name: "Pizza Végétarienne", quantity: 1, price: 14.50 },
      { name: "Coca-Cola", quantity: 4, price: 2.50 },
    ],
  },
  {
    id: 5,
    number: "FACT-2026-0046",
    clientName: "Thomas Petit",
    clientEmail: "thomas@email.com",
    amount: 34.50,
    tax: 6.90,
    total: 41.40,
    status: "draft" as const,
    date: "22 Juin 2026",
    dueDate: "22 Juillet 2026",
    items: [
      { name: "Pizza Margherita", quantity: 1, price: 12.50 },
      { name: "Pizza Pepperoni", quantity: 1, price: 14.50 },
      { name: "Coca-Cola", quantity: 1, price: 2.50 },
    ],
  },
];

export const invoiceStatusColors = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  canceled: "bg-gray-100 text-gray-500",
};

export const invoiceStatusLabels = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
  canceled: "Annulée",
};