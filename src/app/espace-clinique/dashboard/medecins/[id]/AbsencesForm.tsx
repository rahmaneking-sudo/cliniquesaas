"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AbsencesForm({ medecinId }: { medecinId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    date_debut: "",
    date_fin: "",
    motif: "Congés",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
      setError("La date de fin ne peut pas être antérieure à la date de début.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("absences")
      .insert([
        {
          medecin_id: medecinId,
          date_debut: formData.date_debut,
          date_fin: formData.date_fin,
          motif: formData.motif,
        }
      ]);

    if (insertError) {
      console.error(insertError);
      if (insertError.code === "42P01") {
        setError("Erreur : La table 'absences' n'existe pas encore dans la base de données.");
      } else {
        setError("Erreur lors de l'enregistrement : " + insertError.message);
      }
    } else {
      toast.success("Période bloquée avec succès !", { icon: '🌴' });
      setFormData({ date_debut: "", date_fin: "", motif: "Congés" });
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
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Motif</label>
        <select 
          value={formData.motif}
          onChange={(e) => setFormData({...formData, motif: e.target.value})}
          className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Congés">Congés</option>
          <option value="Maladie">Maladie</option>
          <option value="Formation">Formation</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Du</label>
          <input 
            type="date" 
            required
            min={new Date().toISOString().split("T")[0]}
            value={formData.date_debut}
            onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Au</label>
          <input 
            type="date" 
            required
            min={formData.date_debut || new Date().toISOString().split("T")[0]}
            value={formData.date_fin}
            onChange={(e) => setFormData({...formData, date_fin: e.target.value})}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Bloquer cette période
      </button>
    </form>
  );
}
