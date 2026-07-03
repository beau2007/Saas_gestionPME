-- CreateEnum
CREATE TYPE "public"."SubscriptionPlan" AS ENUM ('free', 'standard', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('active', 'inactive', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "public"."CompanyStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('super_admin', 'admin', 'manager', 'cashier', 'employee');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('active', 'inactive', 'out_of_stock');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('cash', 'card', 'transfer', 'check', 'mobile_payment');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('pending', 'paid', 'partial', 'refunded');

-- CreateEnum
CREATE TYPE "public"."SaleStatus" AS ENUM ('draft', 'completed', 'canceled', 'refunded');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'canceled');

-- CreateEnum
CREATE TYPE "public"."StockMovementType" AS ENUM ('purchase', 'sale', 'adjustment', 'return', 'damage', 'inventory');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('invoice', 'payment', 'stock_alert', 'system', 'reminder');

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "siret" VARCHAR(14),
    "phone" VARCHAR(20),
    "email" VARCHAR(100) NOT NULL,
    "address" TEXT,
    "city" VARCHAR(50),
    "postalCode" VARCHAR(10),
    "country" VARCHAR(50) DEFAULT 'France',
    "logoUrl" VARCHAR(255),
    "subscriptionPlan" "public"."SubscriptionPlan" NOT NULL DEFAULT 'free',
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "subscriptionStatus" "public"."SubscriptionStatus" NOT NULL DEFAULT 'inactive',
    "status" "public"."CompanyStatus" NOT NULL DEFAULT 'active',
    "isTrial" BOOLEAN NOT NULL DEFAULT true,
    "trialEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "avatarUrl" VARCHAR(255),
    "role" "public"."UserRole" NOT NULL DEFAULT 'employee',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" VARCHAR(255),
    "resetToken" VARCHAR(255),
    "resetTokenExpires" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(50),
    "postalCode" VARCHAR(10),
    "country" VARCHAR(50) DEFAULT 'France',
    "companyName" VARCHAR(100),
    "siret" VARCHAR(14),
    "vatNumber" VARCHAR(50),
    "website" VARCHAR(255),
    "notes" TEXT,
    "totalPurchases" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "lastPurchase" TIMESTAMP(3),
    "category" VARCHAR(50),
    "tags" JSONB,
    "status" "public"."ClientStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "reference" VARCHAR(50) NOT NULL,
    "purchasePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "salePrice" DECIMAL(10,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "stockMin" INTEGER NOT NULL DEFAULT 0,
    "stockMax" INTEGER,
    "category" VARCHAR(50),
    "subcategory" VARCHAR(50),
    "barcode" VARCHAR(50),
    "unit" VARCHAR(20) DEFAULT 'unité',
    "weight" DECIMAL(10,2),
    "imageUrl" VARCHAR(255),
    "isComposable" BOOLEAN NOT NULL DEFAULT false,
    "preparationTime" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sales" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT,
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "reference" VARCHAR(50) NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'pending',
    "paymentDate" TIMESTAMP(3),
    "status" "public"."SaleStatus" NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sale_items" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "productName" VARCHAR(100) NOT NULL,
    "productReference" VARCHAR(50),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT,
    "saleId" TEXT,
    "invoiceNumber" VARCHAR(50) NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "pdfPath" VARCHAR(255),
    "notes" TEXT,
    "footerText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saleId" TEXT,
    "quantity" INTEGER NOT NULL,
    "type" "public"."StockMovementType" NOT NULL,
    "beforeStock" INTEGER NOT NULL,
    "afterStock" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "taxDefault" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "taxIncluded" BOOLEAN NOT NULL DEFAULT true,
    "invoicePrefix" VARCHAR(10) NOT NULL DEFAULT 'FACT-',
    "invoiceNextNumber" INTEGER NOT NULL DEFAULT 1,
    "invoiceFooter" TEXT,
    "receiptFooter" TEXT,
    "language" VARCHAR(5) NOT NULL DEFAULT 'fr',
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'Europe/Paris',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "primaryColor" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    "logoUrl" VARCHAR(255),
    "modules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "public"."NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" VARCHAR(255),
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "tableName" VARCHAR(50) NOT NULL,
    "recordId" VARCHAR(50) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_siret_key" ON "public"."companies"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "public"."companies"("email");

-- CreateIndex
CREATE INDEX "companies_subscriptionStatus_idx" ON "public"."companies"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "companies_status_idx" ON "public"."companies"("status");

-- CreateIndex
CREATE INDEX "companies_email_idx" ON "public"."companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "public"."users"("companyId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "clients_companyId_idx" ON "public"."clients"("companyId");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "public"."clients"("email");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "public"."clients"("status");

-- CreateIndex
CREATE INDEX "clients_lastName_firstName_idx" ON "public"."clients"("lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "products_reference_key" ON "public"."products"("reference");

-- CreateIndex
CREATE INDEX "products_companyId_idx" ON "public"."products"("companyId");

-- CreateIndex
CREATE INDEX "products_reference_idx" ON "public"."products"("reference");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "public"."products"("category");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "public"."products"("status");

-- CreateIndex
CREATE INDEX "products_stockQuantity_idx" ON "public"."products"("stockQuantity");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoiceId_key" ON "public"."sales"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_reference_key" ON "public"."sales"("reference");

-- CreateIndex
CREATE INDEX "sales_companyId_idx" ON "public"."sales"("companyId");

-- CreateIndex
CREATE INDEX "sales_clientId_idx" ON "public"."sales"("clientId");

-- CreateIndex
CREATE INDEX "sales_userId_idx" ON "public"."sales"("userId");

-- CreateIndex
CREATE INDEX "sales_reference_idx" ON "public"."sales"("reference");

-- CreateIndex
CREATE INDEX "sales_saleDate_idx" ON "public"."sales"("saleDate");

-- CreateIndex
CREATE INDEX "sales_paymentStatus_idx" ON "public"."sales"("paymentStatus");

-- CreateIndex
CREATE INDEX "sales_status_idx" ON "public"."sales"("status");

-- CreateIndex
CREATE INDEX "sale_items_saleId_idx" ON "public"."sale_items"("saleId");

-- CreateIndex
CREATE INDEX "sale_items_productId_idx" ON "public"."sale_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_saleId_key" ON "public"."invoices"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_companyId_idx" ON "public"."invoices"("companyId");

-- CreateIndex
CREATE INDEX "invoices_clientId_idx" ON "public"."invoices"("clientId");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_invoiceDate_idx" ON "public"."invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "invoices_dueDate_idx" ON "public"."invoices"("dueDate");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "public"."invoices"("status");

-- CreateIndex
CREATE INDEX "stock_movements_productId_idx" ON "public"."stock_movements"("productId");

-- CreateIndex
CREATE INDEX "stock_movements_userId_idx" ON "public"."stock_movements"("userId");

-- CreateIndex
CREATE INDEX "stock_movements_type_idx" ON "public"."stock_movements"("type");

-- CreateIndex
CREATE INDEX "stock_movements_createdAt_idx" ON "public"."stock_movements"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "settings_companyId_key" ON "public"."settings"("companyId");

-- CreateIndex
CREATE INDEX "settings_companyId_idx" ON "public"."settings"("companyId");

-- CreateIndex
CREATE INDEX "notifications_companyId_idx" ON "public"."notifications"("companyId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "public"."notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "public"."notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_sentAt_idx" ON "public"."notifications"("sentAt");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_idx" ON "public"."audit_logs"("companyId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_tableName_idx" ON "public"."audit_logs"("tableName");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "public"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "public"."refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "public"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "public"."refresh_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_items" ADD CONSTRAINT "sale_items_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_items" ADD CONSTRAINT "sale_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movements" ADD CONSTRAINT "stock_movements_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."settings" ADD CONSTRAINT "settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
