"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DeleteDoctorButton({ medecinId, medecinNom }: { medecinId: string, medecinNom: string }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const executeDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("medecins").delete().eq("id", medecinId);

    if (error) {
      console.error(error);
      if (error.code === "42501") {
        toast.error("Accès refusé. Vous n'avez pas les droits pour supprimer ce médecin.");
      } else {
        toast.error("Erreur lors de la suppression : " + error.message);
      }
    } else {
      toast.success(`Le médecin ${medecinNom} a été supprimé.`, { icon: '🗑️' });
      setShowConfirm(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        title="Supprimer ce médecin" 
        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium text-sm p-1.5 border border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Supprimer le médecin ?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement le <span className="font-semibold text-slate-700 dark:text-slate-300">{medecinNom}</span> ? Cette action effacera également tous ses rendez-vous et ses absences.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={executeDelete}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Oui, supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
