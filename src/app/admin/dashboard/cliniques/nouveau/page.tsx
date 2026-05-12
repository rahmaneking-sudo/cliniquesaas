"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Save, Loader2, Building2 } from "lucide-react";
import Link from "next/link";

export default function NouvelleClinique() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    slug: "",
    adresse: "",
    quartier: "",
    ville: "Dakar",
    telephone: "",
    email: "",
    description: "",
    statut_abonnement: "gratuit"
  });

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^a-z0-9]/g, "-")      // Remplace les espaces et spéciaux par des tirets
      .replace(/-+/g, "-")             // Retire les tirets multiples
      .replace(/^-|-$/g, "");          // Retire les tirets au début et à la fin
  };

  const handleNomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Vérifier manuellement l'admin avant l'insertion (sécurité front)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "rahmaneking@gmail.com") {
      setError("Erreur d'authentification. Vous devez être l'administrateur principal.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("cliniques").insert([
      {
        nom: formData.nom,
        slug: formData.slug,
        adresse: formData.adresse,
        quartier: formData.quartier,
        ville: formData.ville,
        telephone: formData.telephone,
        email: formData.email,
        description: formData.description,
        statut_abonnement: formData.statut_abonnement
      }
    ]);

    if (insertError) {
      console.error(insertError);
      if (insertError.code === "42501") {
        setError("Accès refusé. Avez-vous exécuté la requête SQL pour autoriser l'administrateur à insérer des cliniques ?");
      } else {
        setError("Erreur lors de la création : " + insertError.message);
      }
      setLoading(false);
    } else {
      router.push("/admin/dashboard/cliniques");
      router.refresh();
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <Link 
        href="/admin/dashboard/cliniques"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux cliniques
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-indigo-600" />
          Ajouter une clinique
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Créez une nouvelle fiche clinique dans l'annuaire.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom de la clinique</label>
            <input 
              type="text" 
              required
              value={formData.nom}
              onChange={handleNomChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Clinique Pasteur"
            />
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
            <p className="text-xs text-slate-500 mt-1">C'est ce qui apparaîtra dans le lien : /clinique/{formData.slug}</p>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse complète</label>
            <input 
              type="text" 
              required
              value={formData.adresse}
              onChange={(e) => setFormData({...formData, adresse: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 12 Rue de la Paix"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quartier</label>
            <input 
              type="text" 
              required
              value={formData.quartier}
              onChange={(e) => setFormData({...formData, quartier: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Plateau"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ville</label>
            <select 
              value={formData.ville}
              onChange={(e) => setFormData({...formData, ville: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Ziguinchor">Ziguinchor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone de contact</label>
            <input 
              type="tel" 
              required
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+221 33 000 00 00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email de contact (Optionnel)</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="contact@clinique.sn"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
            placeholder="Présentation de la clinique, de ses équipements..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Abonnement SaaS</label>
          <select 
            value={formData.statut_abonnement}
            onChange={(e) => setFormData({...formData, statut_abonnement: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700 dark:text-indigo-400"
          >
            <option value="gratuit">Gratuit (Limité)</option>
            <option value="premium">Premium (Standard)</option>
            <option value="entreprise">Entreprise (VIP)</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer la clinique
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
