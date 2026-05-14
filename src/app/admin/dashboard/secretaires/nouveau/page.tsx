"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, UserPlus, Loader2, Mail, Lock, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createSecretaire } from "@/app/actions/create-secretaire";

export default function NouvelleSecretaire() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ email: string; clinique: string } | null>(null);
  const [cliniques, setCliniques] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    clinique_id: "",
  });

  useEffect(() => {
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

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const result = await createSecretaire({
      email: formData.email,
      password: formData.password,
      clinic_id: formData.clinique_id,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess({ email: result.userEmail!, clinique: result.cliniqueName! });
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Secrétaire créée avec succès !</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Le compte <strong className="text-slate-900 dark:text-white">{success.email}</strong> a été créé et lié à la clinique <strong className="text-slate-900 dark:text-white">{success.clinique}</strong>.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
            La secrétaire peut dès maintenant se connecter à l'Espace Clinique avec ces identifiants.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/admin/dashboard/secretaires"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md"
            >
              Voir les secrétaires
            </Link>
            <button
              onClick={() => {
                setSuccess(null);
                setFormData({ email: "", password: "", clinique_id: cliniques[0]?.id || "" });
              }}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Créer une autre
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <UserPlus className="w-8 h-8 text-indigo-600" />
          Créer une secrétaire
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Créez un compte secrétaire et rattachez-le à une clinique en un clic.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email de la secrétaire</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="secretaire@clinique.sn"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="password" 
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Minimum 6 caractères"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-1">Ce mot de passe sera utilisé par la secrétaire pour se connecter à l'Espace Clinique.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clinique cible</label>
          <div className="relative">
            <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              required
              value={formData.clinique_id}
              onChange={(e) => setFormData({...formData, clinique_id: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all"
              disabled={loading}
            >
              {cliniques.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading || cliniques.length === 0}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Créer le compte secrétaire
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
