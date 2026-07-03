// src/components/auth/SocialLogin.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    toast.info("Connexion avec " + provider, {
      description: "Cette fonctionnalité sera bientôt disponible.",
      duration: 3000,
    });
  };

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-11"
        onClick={() => handleSocialLogin("Google")}
      >
        
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11"
        onClick={() => handleSocialLogin("GitHub")}
      >
   
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11"
        onClick={() => handleSocialLogin("Email")}
      >
        <Mail className="h-5 w-5" />
      </Button>
    </div>
  );
}