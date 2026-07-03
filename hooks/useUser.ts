// src/hooks/useUser.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  company: {
    id: string;
    name: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
  } | null;
}

export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      // Vérifier si les données sont en cache
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          setUser(parsed);
          setIsLoading(false);
          return;
        } catch (e) {
          // Cache invalide, continuer avec l'appel API
        }
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Session expirée");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Erreur de chargement du profil:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No token");
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Session expirée");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Erreur de rafraîchissement du profil:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    logout,
    refreshUser,
  };
}