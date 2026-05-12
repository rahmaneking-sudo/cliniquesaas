"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

export default function RevokeButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRevoke = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir révoquer l'accès de cette secrétaire ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    
    // Vérification admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "rahmaneking@gmail.com") {
      alert("Erreur d'authentification. Vous devez être l'administrateur principal.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("utilisateurs_clinique")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error(error);
      alert("Erreur lors de la révocation : " + error.message);
    } else {
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleRevoke}
      disabled={loading}
      title="Révoquer l'accès" 
      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium text-sm px-3 py-1 border border-red-200 dark:border-red-800 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ml-auto"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Révoquer
    </button>
  );
}
