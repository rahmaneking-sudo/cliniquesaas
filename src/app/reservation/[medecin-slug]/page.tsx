import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReservationForm from "@/components/ReservationForm";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ReservationPage({ params }: { params: { "medecin-slug": string } }) {
  const { "medecin-slug": slug } = await params;
  const supabase = await createClient();

  // Fetch doctor and clinic details
  const { data: medecin, error } = await supabase
    .from("medecins")
    .select(`
      id,
      nom,
      specialite,
      photo_url,
      cliniques (
        id,
        nom,
        adresse,
        ville,
        slug
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !medecin) {
    notFound();
  }

  // Type assertion for the joined data since Supabase typing might be loose here
  const clinicData = Array.isArray(medecin.cliniques) ? medecin.cliniques[0] : medecin.cliniques;

  if (!clinicData) {
    notFound();
  }

  const medecinForForm = {
    id: medecin.id,
    nom: medecin.nom,
    specialite: medecin.specialite,
    cliniques: {
      id: clinicData.id,
      nom: clinicData.nom
    }
  };

  return (
    <div className="w-full flex-1 bg-slate-50 dark:bg-slate-950 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <Link 
          href={`/clinique/${clinicData.slug}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au profil de la clinique
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Doctor Info Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 border-4 border-white dark:border-slate-900 shadow-lg">
                {medecin.photo_url ? (
                  <img src={medecin.photo_url} alt={medecin.nom} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                    {medecin.nom.charAt(0)}
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{medecin.nom}</h1>
              <p className="text-cyan-600 dark:text-cyan-400 font-medium">{medecin.specialite}</p>
              
              <hr className="my-4 border-slate-100 dark:border-slate-800" />
              
              <div className="flex flex-col items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">{clinicData.nom}</span>
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {clinicData.adresse}, {clinicData.ville}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
              <strong>💡 Bon à savoir :</strong>
              <p className="mt-2">Vous paierez votre consultation directement sur place à la clinique. Aucun paiement n'est requis pour réserver.</p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <ReservationForm medecin={medecinForForm} />
          </div>

        </div>
      </div>
    </div>
  );
}
