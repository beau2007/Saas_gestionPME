// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
];

const dashboardRoutes = [
  "/dashboard-user",
  "/dashboard-user/",
  "/dashboard-user/employees",
  "/dashboard-user/products",
  "/dashboard-user/sales",
  "/dashboard-user/clients",
  "/dashboard-user/invoices",
  "/dashboard-user/reports",
  "/dashboard-user/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ Vérifier le token dans les cookies OU dans le localStorage (via header)
  const token = 
    request.cookies.get("token")?.value || 
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    // ✅ Récupérer le token depuis l'URL si présent (pour débogage)
    request.nextUrl.searchParams.get("token");

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // ✅ Si c'est une route dashboard et qu'on a un token, laisser passer
  const isDashboardRoute = dashboardRoutes.some((route) => 
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isDashboardRoute && token) {
    return NextResponse.next();
  }

  // Si c'est une route publique, on laisse passer
  if (isPublicRoute) {
    // Si l'utilisateur est connecté et essaie d'accéder à login/register, on redirige vers dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard-user", request.url));
    }
    return NextResponse.next();
  }

  // Si c'est une route protégée sans token
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images).*)",
  ],
};