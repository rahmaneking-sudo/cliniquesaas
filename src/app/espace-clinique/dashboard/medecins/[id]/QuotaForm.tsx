"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Save, Users, Infinity } from "lucide-react";
import { toast } from "react-hot-toast";

interface QuotaFormProps {
  medecinId: string;
  medecinNom: string;
  currentQuota: number | null;
}

export default function QuotaForm({ medecinId, medecinNom, currentQuota }: QuotaFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isLimited, setIsLimited] = useState(currentQuota !== null);
  const [quota, setQuota] = useState(currentQuota || 20);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newQuota = isLimited ? quota : null;

    const { error } = await supabase
      .from("medecins")
      .update({ max_patients_par_jour: newQuota })
      .eq("id", medecinId);

    if (error) {
      toast.error("Erreur lors de la sauvegarde : " + error.message);
    } else {
      toast.success(
        isLimited
          ? `Quota défini à ${quota} patients/jour pour Dr. ${medecinNom}`
          : `Quota illimité pour Dr. ${medecinNom}`,
        { icon: "👥" }
      );
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {isLimited ? (
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Infinity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isLimited ? "Limité" : "Illimité"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isLimited
                ? `Max ${quota} patients par jour`
                : "Aucune limite de patients"}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isLimited}
            onChange={(e) => setIsLimited(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {isLimited && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre maximum de patients par jour
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuota(Math.max(1, quota - 1))}
              className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors flex items-center justify-center"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={200}
              value={quota}
              onChange={(e) => setQuota(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setQuota(Math.min(200, quota + 1))}
              className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors flex items-center justify-center"
            >
              +
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">patients/jour</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Une fois ce nombre atteint, les patients ne pourront plus prendre de RDV ce jour-là.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Sauvegarder le quota
      </button>
    </form>
  );
}
