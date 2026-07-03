// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  subscriptionPlan: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("company");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedCompany) {
        setCompany(JSON.parse(storedCompany));
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    setToken(null);
    setUser(null);
    setCompany(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    user,
    company,
    isAuthenticated,
    logout,
  };
}