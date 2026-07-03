// src/controllers/AuthController.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from "@/lib/jwt";
import { successResponse, errorResponse, createdResponse, unauthorizedResponse } from "@/lib/response";

export class AuthController {
  // ============================================
  // 1. INSCRIPTION
  // ============================================
  static async register(req: NextRequest) {
    try {
      const body = await req.json();
      const { companyName, firstName, lastName, email, phone, password } = body;

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return errorResponse("Cet email est déjà utilisé", 400);
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(password);

      // Créer l'entreprise et l'utilisateur dans une transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Créer l'entreprise
        const company = await tx.company.create({
          data: {
            name: companyName,
            email,
            phone: phone || "",
            subscriptionPlan: "free",
            subscriptionStatus: "active",
            status: "active",
            isTrial: true,
            trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          },
        });

        // 2. Créer les paramètres par défaut
        await tx.settings.create({
          data: {
            companyId: company.id,
            currency: "EUR",
            taxDefault: 20,
            invoicePrefix: "FACT-",
            invoiceNextNumber: 1,
          },
        });

        // 3. Créer l'utilisateur admin
        const user = await tx.user.create({
          data: {
            companyId: company.id,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || "",
            role: "admin",
            status: "active",
            emailVerified: false,
          },
        });

        return { company, user };
      });

      // Générer le token de vérification d'email
      const verificationToken = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
      });

      // Sauvegarder le token de vérification
      await prisma.user.update({
        where: { id: result.user.id },
        data: { verificationToken },
      });

      // Envoyer l'email de vérification (à implémenter)
      console.log(`🔗 Vérification : ${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`);

      // Générer les tokens de session
      const token = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        companyId: result.user.companyId || undefined,
      });

      const refreshToken = generateRefreshToken({
        userId: result.user.id,
      });

      return createdResponse(
        {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
            emailVerified: result.user.emailVerified,
          },
          company: {
            id: result.company.id,
            name: result.company.name,
            subscriptionPlan: result.company.subscriptionPlan,
          },
          token,
          refreshToken,
        },
        "Inscription réussie ! Vérifiez votre email pour activer votre compte."
      );
    } catch (error: any) {
      console.error("Register error:", error);
      return errorResponse(error.message || "Erreur lors de l'inscription", 500);
    }
  }

  // ============================================
  // 2. CONNEXION
  // ============================================
  static async login(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return errorResponse("Email et mot de passe requis", 400);
      }

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true },
      });

      if (!user) {
        return errorResponse("Email ou mot de passe incorrect", 401);
      }

      // Vérifier le statut
      if (user.status === "suspended") {
        return errorResponse("Votre compte a été suspendu. Contactez le support.", 403);
      }

      if (user.status === "inactive") {
        return errorResponse("Votre compte est inactif. Contactez le support.", 403);
      }

      // Vérifier le mot de passe
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        // Incrémenter le compteur de tentatives
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: { increment: 1 } },
        });
        return errorResponse("Email ou mot de passe incorrect", 401);
      }

      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          loginAttempts: 0,
        },
      });

      // Générer les tokens
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId || undefined,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
      });

      return successResponse({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
        },
        company: user.company
          ? {
              id: user.company.id,
              name: user.company.name,
              subscriptionPlan: user.company.subscriptionPlan,
              subscriptionStatus: user.company.subscriptionStatus,
            }
          : null,
        token,
        refreshToken,
      }, "Connexion réussie !");
    } catch (error: any) {
      console.error("Login error:", error);
      return errorResponse("Erreur lors de la connexion", 500);
    }
  }

  // ============================================
  // 3. PROFIL UTILISATEUR
  // ============================================
  static async me(req: NextRequest) {
    try {
      const user = (req as any).user;

      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          company: {
            include: {
              settings: true,
            },
          },
        },
      });

      if (!userData) {
        return errorResponse("Utilisateur non trouvé", 404);
      }

      return successResponse({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        emailVerified: userData.emailVerified,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt,
        company: userData.company
          ? {
              id: userData.company.id,
              name: userData.company.name,
              siret: userData.company.siret,
              phone: userData.company.phone,
              address: userData.company.address,
              city: userData.company.city,
              postalCode: userData.company.postalCode,
              country: userData.company.country,
              subscriptionPlan: userData.company.subscriptionPlan,
              subscriptionStatus: userData.company.subscriptionStatus,
              trialEnd: userData.company.trialEnd,
              settings: userData.company.settings,
            }
          : null,
      });
    } catch (error: any) {
      console.error("Me error:", error);
      return errorResponse("Erreur lors de la récupération du profil", 500);
    }
  }

  // ============================================
  // 4. DÉCONNEXION
  // ============================================
  static async logout(req: NextRequest) {
    try {
      // Le logout est géré côté client (suppression du token local)
      // On peut ajouter une blacklist des tokens si nécessaire
      return successResponse(null, "Déconnexion réussie");
    } catch (error: any) {
      return errorResponse("Erreur lors de la déconnexion", 500);
    }
  }

  // ============================================
  // 5. RAFRAÎCHIR LE TOKEN
  // ============================================
  static async refreshToken(req: NextRequest) {
    try {
      const body = await req.json();
      const { refreshToken } = body;

      if (!refreshToken) {
        return errorResponse("Refresh token requis", 400);
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return unauthorizedResponse("Token invalide ou expiré");
      }

      const user = await prisma.user.findUnique({
        where: { id: (decoded as any).userId },
      });

      if (!user) {
        return errorResponse("Utilisateur non trouvé", 404);
      }

      if (user.status === "suspended" || user.status === "inactive") {
        return errorResponse("Compte inactif", 403);
      }

      // Générer un nouveau token
      const newToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId || undefined,
      });

      // Générer un nouveau refresh token
      const newRefreshToken = generateRefreshToken({
        userId: user.id,
      });

      return successResponse({
        token: newToken,
        refreshToken: newRefreshToken,
      }, "Token rafraîchi avec succès");
    } catch (error: any) {
      console.error("Refresh token error:", error);
      return errorResponse("Erreur lors du rafraîchissement du token", 500);
    }
  }

  // ============================================
  // 6. MOT DE PASSE OUBLIÉ
  // ============================================
  static async forgotPassword(req: NextRequest) {
    try {
      const body = await req.json();
      const { email } = body;

      if (!email) {
        return errorResponse("Email requis", 400);
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // On ne révèle pas si l'email existe (sécurité)
        return successResponse(
          null,
          "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
        );
      }

      // Générer un token de réinitialisation
      const resetToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Sauvegarder le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
        },
      });

      // Envoyer l'email
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
      console.log(`🔑 Lien de réinitialisation : ${resetLink}`);

      // À implémenter : envoi d'email réel
      // await sendResetPasswordEmail(email, resetLink);

      return successResponse(
        null,
        "Un email de réinitialisation a été envoyé à votre adresse."
      );
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return errorResponse("Erreur lors de la demande de réinitialisation", 500);
    }
  }

  // ============================================
  // 7. RÉINITIALISER LE MOT DE PASSE
  // ============================================
  static async resetPassword(req: NextRequest) {
    try {
      const body = await req.json();
      const { token, password } = body;

      if (!token || !password) {
        return errorResponse("Token et nouveau mot de passe requis", 400);
      }

      if (password.length < 8) {
        return errorResponse("Le mot de passe doit contenir au moins 8 caractères", 400);
      }

      // Vérifier le token
      const decoded = verifyToken(token);
      if (!decoded) {
        return errorResponse("Token invalide ou expiré", 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: (decoded as any).userId },
      });

      if (!user) {
        return errorResponse("Utilisateur non trouvé", 404);
      }

      // Vérifier que le token correspond
      if (user.resetToken !== token) {
        return errorResponse("Token invalide", 400);
      }

      // Vérifier l'expiration
      if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
        return errorResponse("Token expiré", 400);
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await hashPassword(password);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      return successResponse(null, "Mot de passe réinitialisé avec succès.");
    } catch (error: any) {
      console.error("Reset password error:", error);
      return errorResponse("Erreur lors de la réinitialisation du mot de passe", 500);
    }
  }
}