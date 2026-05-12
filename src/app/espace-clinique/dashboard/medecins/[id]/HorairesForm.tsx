"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-hot-toast";

type JourHoraires = {
  actif: boolean;
  debut: string;
  fin: string;
};

type Horaires = {
  [key: string]: JourHoraires;
};

export default function HorairesForm({ medecinId, horairesInitiaux }: { medecinId: string, horairesInitiaux: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Horaires par défaut si non définis
  const defaultHoraires: Horaires = {
    lundi: { actif: true, debut: "09:00", fin: "17:00" },
    mardi: { actif: true, debut: "09:00", fin: "17:00" },
    mercredi: { actif: true, debut: "09:00", fin: "17:00" },
    jeudi: { actif: true, debut: "09:00", fin: "17:00" },
    vendredi: { actif: true, debut: "09:00", fin: "17:00" },
    samedi: { actif: false, debut: "09:00", fin: "12:00" },
    dimanche: { actif: false, debut: "00:00", fin: "00:00" }
  };

  const [horaires, setHoraires] = useState<Horaires>(horairesInitiaux || defaultHoraires);

  const joursOrder = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

  const handleUpdateJour = (jour: string, field: keyof JourHoraires, value: any) => {
    setHoraires((prev) => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase
      .from("medecins")
      .update({ horaires })
      .eq("id", medecinId);

    if (updateError) {
      console.error(updateError);
      if (updateError.code === "42703") {
        setError("La colonne 'horaires' n'existe pas. Vous devez exécuter la requête SQL.");
      } else {
        setError("Erreur lors de l'enregistrement : " + updateError.message);
      }
    } else {
      toast.success("Les horaires du médecin ont été mis à jour avec succès !", {
        icon: '🕒',
      });
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-3">
        {joursOrder.map((jour) => {
          const config = horaires[jour] || defaultHoraires[jour];
          
          return (
            <div key={jour} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="w-24">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.actif}
                    onChange={(e) => handleUpdateJour(jour, "actif", e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                    {jour}
                  </span>
                </label>
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <input 
                  type="time" 
                  value={config.debut}
                  disabled={!config.actif}
                  onChange={(e) => handleUpdateJour(jour, "debut", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                />
                <span className="text-slate-400 text-sm">à</span>
                <input 
                  type="time" 
                  value={config.fin}
                  disabled={!config.actif}
                  onChange={(e) => handleUpdateJour(jour, "fin", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Sauvegarder les horaires
      </button>
    </form>
  );
}
