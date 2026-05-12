import { createClient } from "@/utils/supabase/server";
import { Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteDoctorButton from "./DeleteDoctorButton";

export default async function CliniqueMedecins() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/espace-clinique");

  const isAdmin = user.email === "rahmaneking@gmail.com";
  let clinicId = null;

  if (isAdmin) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    clinicId = cookieStore.get("admin_clinic_id")?.value;
    
    if (!clinicId) {
      return (
        <div className="p-8 w-full max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Mode Admin Actif</h2>
            <p className="text-slate-500">Veuillez sélectionner une clinique dans la barre violette en haut pour voir ses médecins.</p>
          </div>
        </div>
      );
    }
  } else {
    // On récupère l'ID de la clinique de la secrétaire
    const { data: userData } = await supabase
      .from("utilisateurs_clinique")
      .select("clinic_id")
      .eq("id", user.id)
      .single();

    clinicId = userData?.clinic_id;
    if (!clinicId) redirect("/espace-clinique");
  }

  // On récupère les médecins de cette clinique spécifique
  const { data: medecins } = await supabase
    .from("medecins")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("nom");

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-cyan-600" />
            Gestion des Médecins
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez l'équipe médicale de votre clinique.</p>
        </div>
        
        <Link 
          href="/espace-clinique/dashboard/medecins/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          Ajouter un médecin
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="p-4">Docteur</th>
                <th className="p-4">Slug public</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {medecins?.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {med.photo_url ? (
                      <img src={med.photo_url} alt={med.nom} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-700 font-bold">
                        {med.nom.substring(3, 4).toUpperCase()}
                      </div>
                    )}
                    {med.nom}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-sm">{med.slug}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{med.specialite}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/espace-clinique/dashboard/medecins/${med.id}`}
                        className="text-cyan-600 dark:text-cyan-400 font-medium text-sm px-3 py-1 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors inline-block"
                      >
                        Gérer l'agenda
                      </Link>
                      <DeleteDoctorButton medecinId={med.id} medecinNom={med.nom} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!medecins || medecins.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    Vous n'avez pas encore ajouté de médecins à votre clinique.
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
