import { createClient } from "@/utils/supabase/server";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import RevokeButton from "./RevokeButton";
export default async function AdminSecretaires() {
  const supabase = await createClient();

  // On récupère les utilisateurs liés aux cliniques
  const { data: secretaires } = await supabase
    .from("utilisateurs_clinique")
    .select(`
      id,
      role,
      clinique:cliniques (
        nom,
        ville
      )
    `);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Accès Secrétaires
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez les liaisons entre les comptes Supabase et les cliniques.</p>
        </div>
        
        <Link 
          href="/admin/dashboard/secretaires/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          Créer une secrétaire
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="p-4">ID Supabase de l'utilisateur</th>
                <th className="p-4">Clinique rattachée</th>
                <th className="p-4">Rôle</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {secretaires?.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-900 dark:text-white font-mono text-sm">{sec.id}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {/* @ts-ignore */}
                    {sec.clinique?.nom || "Non défini"}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold capitalize">
                      {sec.role}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end">
                    <RevokeButton userId={sec.id} />
                  </td>
                </tr>
              ))}
              {(!secretaires || secretaires.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    Aucun accès secrétaire n'a été lié pour le moment.
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
