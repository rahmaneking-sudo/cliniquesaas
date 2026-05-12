"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Save, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NouveauMedecin() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    slug: "",
    specialite: "",
    description: "",
  });

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si l'utilisateur n'a pas tapé "Dr.", on l'ajoute virtuellement ou on le laisse taper
    const nom = e.target.value;
    setFormData({
      ...formData,
      nom,
      slug: generateSlug(nom)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Non connecté");
      setLoading(false);
      return;
    }

    const isAdmin = user.email === "rahmaneking@gmail.com";
    let clinicId = null;

    if (isAdmin) {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      clinicId = getCookie("admin_clinic_id");
      
      if (!clinicId) {
        setError("Veuillez sélectionner une clinique dans le menu Admin en haut avant de créer un médecin.");
        setLoading(false);
        return;
      }
    } else {
      // Récupérer son ID de clinique
      const { data: userData, error: userError } = await supabase
        .from("utilisateurs_clinique")
        .select("clinic_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.clinic_id) {
        setError("Impossible de trouver votre clinique. Contactez l'administrateur.");
        setLoading(false);
        return;
      }
      clinicId = userData.clinic_id;
    }

    // Insérer le médecin avec le clinic_id automatique
    const { error: insertError } = await supabase.from("medecins").insert([
      {
        nom: formData.nom,
        slug: formData.slug,
        specialite: formData.specialite,
        description: formData.description,
        clinic_id: clinicId
      }
    ]);

    if (insertError) {
      console.log("Supabase Insert Error:", insertError);
      if (insertError.code === "42501") {
        setError("Accès refusé (RLS). Si vous êtes l'Admin, vous devez être rattaché à cette clinique dans la base de données, ou avoir une règle SQL spéciale.");
      } else {
        setError("Erreur : " + insertError.message);
      }
      setLoading(false);
    } else {
      router.push("/espace-clinique/dashboard/medecins");
      router.refresh();
    }
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <Link 
        href="/espace-clinique/dashboard/medecins"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux médecins
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-cyan-600" />
          Ajouter un médecin
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          La fiche de ce médecin sera rattachée automatiquement à votre clinique.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom complet du médecin</label>
            <input 
              type="text" 
              required
              value={formData.nom}
              onChange={handleNomChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Ex: Dr. Aminata Sall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Spécialité</label>
            <input 
              type="text" 
              required
              value={formData.specialite}
              onChange={(e) => setFormData({...formData, specialite: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Ex: Cardiologue"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug (URL générée automatiquement)</label>
          <input 
            type="text" 
            required
            readOnly
            value={formData.slug}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 outline-none font-mono text-sm cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">Ce champ est généré automatiquement, c'est l'identifiant pour le lien web.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description / Parcours</label>
          <textarea 
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none min-h-[120px]"
            placeholder="Présentation du médecin, diplômes, expérience..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Ajouter le médecin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
