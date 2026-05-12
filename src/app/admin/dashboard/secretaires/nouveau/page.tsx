"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LierSecretaire() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cliniques, setCliniques] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id_supabase: "",
    clinique_id: "",
  });

  useEffect(() => {
    // Charger la liste des cliniques pour le select
    const fetchCliniques = async () => {
      const { data } = await supabase.from("cliniques").select("id, nom").order("nom");
      if (data) {
        setCliniques(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, clinique_id: data[0].id }));
        }
      }
    };
    fetchCliniques();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Vérification de sécurité frontend
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "rahmaneking@gmail.com") {
      setError("Accès refusé.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("utilisateurs_clinique").insert([
      {
        id: formData.id_supabase,
        clinic_id: formData.clinique_id,
        role: "secretaire"
      }
    ]);

    if (insertError) {
      console.error(insertError);
      if (insertError.code === "42501") {
        setError("Accès refusé par la base de données. Avez-vous ajouté la règle SQL pour autoriser l'admin sur cette table ?");
      } else if (insertError.code === "23505") {
        setError("Cet utilisateur est déjà lié à une clinique.");
      } else {
        setError("Erreur : " + insertError.message);
      }
      setLoading(false);
    } else {
      router.push("/admin/dashboard/secretaires");
      router.refresh();
    }
  };

  return (
    <div className="p-8 w-full max-w-2xl mx-auto">
      <Link 
        href="/admin/dashboard/secretaires"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux accès
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
          <LinkIcon className="w-8 h-8 text-indigo-600" />
          Lier une secrétaire
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Rattachez un compte créé sur Supabase à une clinique spécifique.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 font-medium text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1">Rappel important :</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Vous devez d'abord créer l'utilisateur (Email + Mot de passe) dans votre tableau de bord Supabase (Menu Authentication). Ensuite, copiez son <strong>User UID</strong> et collez-le ci-dessous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Supabase (UID) de l'utilisateur</label>
          <input 
            type="text" 
            required
            value={formData.id_supabase}
            onChange={(e) => setFormData({...formData, id_supabase: e.target.value.trim()})}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
            placeholder="Ex: d8b2c4e...-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clinique cible</label>
          <select 
            required
            value={formData.clinique_id}
            onChange={(e) => setFormData({...formData, clinique_id: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {cliniques.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading || cliniques.length === 0}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LinkIcon className="w-5 h-5" />
            )}
            Valider la liaison
          </button>
        </div>
      </form>
    </div>
  );
}
