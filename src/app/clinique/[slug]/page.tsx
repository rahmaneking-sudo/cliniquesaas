import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Star, Users, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: clinique } = await supabase.from("cliniques").select("nom, description, ville").eq("slug", slug).single();
  
  if (!clinique) return { title: "Clinique introuvable | RDV Santé" };
  
  return {
    title: `${clinique.nom} - ${clinique.ville} | RDV Santé`,
    description: clinique.description || `Prenez rendez-vous en ligne avec ${clinique.nom} à ${clinique.ville}.`,
  };
}

export default async function CliniqueProfile({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch clinic details
  const { data: clinique, error } = await supabase
    .from("cliniques")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !clinique || clinique.statut_abonnement === "suspendu") {
    notFound();
  }

  // Fetch doctors for this clinic
  const { data: medecins } = await supabase
    .from("medecins")
    .select("*")
    .eq("clinic_id", clinique.id)
    .eq("actif", true);

  return (
    <div className="w-full flex-1 bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="w-full h-64 md:h-80 bg-slate-200 dark:bg-slate-800 relative">
        {clinique.photo_url ? (
          <img src={clinique.photo_url} alt={clinique.nom} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-cyan-600 to-blue-700 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 pb-8 flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-2">{clinique.nom}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-200 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {clinique.adresse}, {clinique.quartier} - {clinique.ville}
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{clinique.note_moyenne} / 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Doctors List) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-600" />
              Équipe médicale ({medecins?.length || 0})
            </h2>
            
            {(!medecins || medecins.length === 0) ? (
              <p className="text-slate-500 py-4">Aucun médecin disponible pour le moment dans cette clinique.</p>
            ) : (
              <div className="space-y-4 mt-6">
                {medecins.map((medecin) => (
                  <div key={medecin.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-900/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                      {medecin.photo_url ? (
                        <img src={medecin.photo_url} alt={medecin.nom} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-500">
                          {medecin.nom.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{medecin.nom}</h3>
                      <p className="text-cyan-600 dark:text-cyan-400 font-medium">{medecin.specialite}</p>
                      {medecin.bio && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{medecin.bio}</p>}
                    </div>

                    <Link href={`/reservation/${medecin.slug}`} className="w-full md:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors shrink-0 text-center flex items-center justify-center gap-2">
                      <CalendarCheck className="w-4 h-4" />
                      Prendre RDV
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Clinic Info) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">À propos</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {clinique.description || "Aucune description fournie par la clinique pour le moment."}
            </p>
            
            <hr className="border-slate-100 dark:border-slate-800 mb-6" />
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <span>
                  <strong>Adresse</strong><br />
                  {clinique.adresse}<br />
                  {clinique.quartier}, {clinique.ville}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{clinique.telephone}</span>
              </div>
              {clinique.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{clinique.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
