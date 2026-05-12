import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReservationActions from "@/components/ReservationActions";

export default async function ReservationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/espace-clinique");

  // Identifier la clinique
  const { data: uc } = await supabase.from("utilisateurs_clinique").select("clinic_id").eq("id", user.id).single();
  if (!uc?.clinic_id) redirect("/espace-clinique/dashboard");

  // Récupérer les infos de la clinique (slug + nom)
  const { data: clinique } = await supabase.from("cliniques").select("slug, nom").eq("id", uc.clinic_id).single();

  // Récupérer toutes les réservations futures (à partir d'aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  const { data: reservations } = await supabase
    .from("reservations")
    .select("*, medecins(nom)")
    .eq("clinic_id", uc.clinic_id)
    .gte("date_rdv", today)
    .neq("statut", "termine")
    .order("date_rdv", { ascending: true })
    .order("heure_rdv", { ascending: true });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Link 
        href="/espace-clinique/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">
            Agenda Complet
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gérez toutes les réservations à venir de votre clinique.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-0">
          {(!reservations || reservations.length === 0) ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
              <p>Aucun rendez-vous futur n'a été trouvé.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reservations.map((rdv) => (
                <div key={rdv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 flex flex-col items-center justify-center shrink-0 border border-cyan-100 dark:border-cyan-800">
                      <span className="text-xs font-bold uppercase">{new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      <span className="text-lg font-black">{new Date(rdv.date_rdv).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{rdv.nom_patient}</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        À <span className="font-bold text-slate-700 dark:text-slate-300">{rdv.heure_rdv.substring(0,5)}</span> avec <span className="font-medium text-slate-700 dark:text-slate-300">Dr. {rdv.medecins?.nom}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${rdv.statut === 'reporte' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {rdv.statut === 'reporte' ? 'Reporté' : 'Confirmé'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">Tel: {rdv.whatsapp_patient}</span>
                      </div>
                      {rdv.motif && (
                        <p className="text-sm text-slate-500 mt-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="font-medium">Motif :</span> {rdv.motif}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 shrink-0">
                    <a 
                      href={`https://wa.me/${rdv.whatsapp_patient?.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${rdv.nom_patient},\n\nVotre RDV avec le Dr. ${rdv.medecins?.nom} le ${new Date(rdv.date_rdv).toLocaleDateString('fr-FR')} à ${rdv.heure_rdv.substring(0,5)} est bien confirmé.\n\nMerci de nous contacter en cas d'empêchement.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Contacter
                    </a>
                    <ReservationActions 
                      id={rdv.id}
                      nomPatient={rdv.nom_patient}
                      nomMedecin={rdv.medecins?.nom || ""}
                      dateRdv={rdv.date_rdv}
                      heureRdv={rdv.heure_rdv.substring(0,5)}
                      whatsappPatient={rdv.whatsapp_patient || ""}
                      cliniqueSlug={clinique?.slug || ""}
                      cliniqueNom={clinique?.nom || ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
