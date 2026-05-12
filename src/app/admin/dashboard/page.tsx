import { createClient } from "@/utils/supabase/server";
import { Building2, Users, Star, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Statistiques Globales (Lecture publique autorisée par RLS)
  const { count: cliniquesCount } = await supabase.from("cliniques").select("*", { count: "exact", head: true });
  const { count: medecinsCount } = await supabase.from("medecins").select("*", { count: "exact", head: true });
  
  // Récupération des 5 dernières cliniques ajoutées
  const { data: recentesCliniques } = await supabase
    .from("cliniques")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Vue d'ensemble</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez votre réseau de cliniques partenaires.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cliniques Actives</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cliniquesCount || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Médecins Inscrits</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{medecinsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">État du SaaS</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">En ligne</p>
          </div>
        </div>
      </div>

      {/* Récents */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dernières cliniques ajoutées</h2>
          <Link href="/admin/dashboard/cliniques" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            Voir tout
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="p-4">Nom de la clinique</th>
                <th className="p-4">Ville</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Abonnement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentesCliniques?.map((clinique) => (
                <tr key={clinique.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{clinique.nom}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{clinique.ville}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{clinique.telephone}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold capitalize">
                      {clinique.statut_abonnement}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/dashboard/cliniques/${clinique.id}/editer`}
                      className="text-indigo-600 dark:text-indigo-400 font-medium text-sm px-3 py-1 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors inline-block"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
              {(!recentesCliniques || recentesCliniques.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Aucune clinique n'a encore été ajoutée.
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
