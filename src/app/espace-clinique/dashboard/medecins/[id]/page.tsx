import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Calendar, Clock, UserX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AbsencesForm from "./AbsencesForm";
import HorairesForm from "./HorairesForm";
import { Clock8 } from "lucide-react";
export default async function MedecinAgenda({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/espace-clinique");

  // Fetch the doctor
  const { data: medecin, error: medecinError } = await supabase
    .from("medecins")
    .select("*")
    .eq("id", id)
    .single();

  if (medecinError) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl">
          <h2 className="font-bold mb-2">Erreur lors du chargement du médecin</h2>
          <p>{medecinError.message}</p>
        </div>
      </div>
    );
  }

  if (!medecin) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="bg-slate-50 text-slate-700 p-6 rounded-xl">
          <h2 className="font-bold mb-2">Médecin introuvable</h2>
          <p>L'ID {id} n'existe pas ou vous n'y avez pas accès.</p>
        </div>
      </div>
    );
  }

  // Fetch appointments
  const { data: rendezVous, error: rdvError } = await supabase
    .from("rendez_vous")
    .select("*")
    .eq("medecin_id", id)
    .gte("date_rdv", new Date().toISOString().split("T")[0])
    .order("date_rdv", { ascending: true })
    .order("heure_rdv", { ascending: true });

  // Fetch absences
  const { data: absences, error: absError } = await supabase
    .from("absences")
    .select("*")
    .eq("medecin_id", id)
    .gte("date_fin", new Date().toISOString().split("T")[0])
    .order("date_debut", { ascending: true });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      <Link 
        href="/espace-clinique/dashboard/medecins"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux médecins
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyan-600" />
            Agenda du Dr. {medecin.nom.replace('Dr. ', '').replace('Dr ', '')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez les rendez-vous et les disponibilités.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Liste des rendez-vous */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Rendez-vous à venir</h2>
            
            {rdvError && rdvError.code === "42P01" && (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl mb-6">
                La table `rendez_vous` n'existe pas encore. L'affichage des RDV sera activé une fois la table créée.
              </div>
            )}

            <div className="space-y-4">
              {rendezVous && rendezVous.length > 0 ? (
                rendezVous.map((rdv: any) => (
                  <div key={rdv.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{rdv.patient_nom || "Patient non spécifié"}</div>
                      <div className="text-sm text-slate-500">{rdv.motif || "Consultation standard"}</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(rdv.date_rdv)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{rdv.heure_rdv}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (!rdvError || rdvError.code !== "42P01") && (
                <div className="text-center py-8 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  Aucun rendez-vous prévu pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gestion des Horaires */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 text-cyan-600 dark:text-cyan-400">
              <Clock8 className="w-6 h-6" />
              <h2 className="text-xl font-bold">Disponibilités</h2>
            </div>
            
            <HorairesForm medecinId={medecin.id} horairesInitiaux={medecin.horaires} />
          </div>

          {/* Gestion des absences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 text-orange-600 dark:text-orange-400">
              <UserX className="w-6 h-6" />
              <h2 className="text-xl font-bold">Gérer les absences</h2>
            </div>
            
            <AbsencesForm medecinId={medecin.id} />

            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Absences programmées</h3>
              <div className="space-y-3">
                {absError && absError.code === "42P01" && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                    La table `absences` doit être créée.
                  </div>
                )}
                {absences && absences.length > 0 ? (
                  absences.map((abs: any) => (
                    <div key={abs.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{abs.motif || "Absence"}</div>
                      <div className="text-xs text-slate-500">
                        Du {formatDate(abs.date_debut)}
                        <br />
                        Au {formatDate(abs.date_fin)}
                      </div>
                    </div>
                  ))
                ) : (!absError || absError.code !== "42P01") && (
                  <div className="text-sm text-slate-500">
                    Aucune absence programmée.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
