import { createClient } from "@/utils/supabase/server";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminCliniques() {
  const supabase = await createClient();

  const { data: cliniques } = await supabase
    .from("cliniques")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Gestion des Cliniques</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez vos cliniques partenaires et leurs abonnements.</p>
        </div>
        
        <Link 
          href="/admin/dashboard/cliniques/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          Ajouter une clinique
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50 dark:bg-slate-950">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une clinique..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="p-4">Nom</th>
                <th className="p-4">Slug (URL)</th>
                <th className="p-4">Ville</th>
                <th className="p-4">Note</th>
                <th className="p-4">Abonnement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cliniques?.map((clinique) => (
                <tr key={clinique.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {clinique.photo_url ? (
                      <img src={clinique.photo_url} alt={clinique.nom} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                        {clinique.nom.charAt(0)}
                      </div>
                    )}
                    {clinique.nom}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-sm">{clinique.slug}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{clinique.ville}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">⭐ {clinique.note_moyenne}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold capitalize">
                      {clinique.statut_abonnement}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/dashboard/cliniques/${clinique.id}/editer`} 
                      className="text-indigo-600 dark:text-indigo-400 font-medium text-sm px-3 py-1 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
              {(!cliniques || cliniques.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    Vous n'avez pas encore de cliniques partenaires.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
