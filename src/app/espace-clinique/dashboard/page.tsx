import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, CalendarCheck, Clock, LogOut } from "lucide-react";
import Link from "next/link";
import ReservationActions from "@/components/ReservationActions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/espace-clinique");
  }

  // Get clinic info for this user
  const { data: utilisateurClinique } = await supabase
    .from("utilisateurs_clinique")
    .select("clinic_id, role")
    .eq("id", user.id)
    .single();

  if (!utilisateurClinique || !utilisateurClinique.clinic_id) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Compte non configuré</h2>
          <p>Votre compte n'est lié à aucune clinique. Veuillez contacter l'administrateur système.</p>
          <form action="/auth/signout" method="post" className="mt-4">
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">Se déconnecter</button>
          </form>
        </div>
      </div>
    );
  }

  // Fetch clinic details
  const { data: clinique } = await supabase
    .from("cliniques")
    .select("*")
    .eq("id", utilisateurClinique.clinic_id)
    .single();

  // Fetch doctors count
  const { count: medecinsCount } = await supabase
    .from("medecins")
    .select("*", { count: "exact", head: true })
    .eq("clinic_id", clinique.id);

  // Fetch today's reservations
  const today = new Date().toISOString().split('T')[0];
  const { data: reservationsToday } = await supabase
    .from("reservations")
    .select("*, medecins(nom)")
    .eq("clinic_id", clinique.id)
    .eq("date_rdv", today)
    .neq("statut", "termine")
    .order("heure_rdv", { ascending: true });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">
            Espace Pro
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {clinique?.nom} — Connecté en tant que {utilisateurClinique.role}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/espace-clinique/dashboard/medecins" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors">
            <Users className="w-4 h-4" />
            Gérer les médecins
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">RDV Aujourd'hui</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{reservationsToday?.length || 0}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Médecins actifs</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{medecinsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Abonnement</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{clinique?.statut_abonnement}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rendez-vous du jour</h2>
          <Link href="/espace-clinique/dashboard/reservations" className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-sm font-medium rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors">
            Voir l'agenda complet
          </Link>
        </div>
        
        <div className="p-0">
          {(!reservationsToday || reservationsToday.length === 0) ? (
            <div className="p-12 text-center text-slate-500">
              <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
              <p>Aucun rendez-vous prévu pour aujourd'hui.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reservationsToday.map((rdv) => (
                <div key={rdv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{rdv.heure_rdv.substring(0,5)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{rdv.nom_patient}</h4>
                      <p className="text-sm text-slate-500 mt-1">Consultation avec : <span className="font-medium text-slate-700 dark:text-slate-300">Dr. {rdv.medecins?.nom}</span></p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${rdv.statut === 'reporte' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {rdv.statut === 'reporte' ? 'Reporté' : 'Confirmé'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">WhatsApp: {rdv.whatsapp_patient}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                    <a 
                      href={`https://wa.me/${rdv.whatsapp_patient?.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${rdv.nom_patient},\n\nVotre RDV avec le Dr. ${rdv.medecins?.nom} le ${rdv.date_rdv} à ${rdv.heure_rdv.substring(0,5)} est bien confirmé.\n\nMerci de nous contacter en cas d'empêchement.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      WhatsApp
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
