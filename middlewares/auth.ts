// middlewares/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export const authMiddleware = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "No token provided", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === "string") {
    return { error: "Invalid token", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: (decoded as any).userId },
    include: { company: true },
  });

  if (!user) {
    return { error: "User not found", status: 404 };
  }

  if (user.status === "suspended" || user.status === "inactive") {
    return { error: "User account is not active", status: 403 };
  }

  return { user };
};

export const requireAuth = async (req: NextRequest) => {
  const result = await authMiddleware(req);
  
  if ("error" in result) {
    return {
      response: NextResponse.json(
        { success: false, message: result.error },
        { status: result.status }
      ),
      user: null,
    };
  }

  return { response: null, user: result.user };
};

export const requireRole = (roles: string[]) => {
  return async (req: NextRequest) => {
    const result = await authMiddleware(req);
    
    if ("error" in result) {
      return {
        response: NextResponse.json(
          { success: false, message: result.error },
          { status: result.status }
        ),
        user: null,
      };
    }

    const user = result.user;
    if (!roles.includes(user.role)) {
      return {
        response: NextResponse.json(
          { success: false, message: "Insufficient permissions" },
          { status: 403 }
        ),
        user: null,
      };
    }

    return { response: null, user };
  };
};