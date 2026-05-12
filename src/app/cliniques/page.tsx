import { createClient } from "@/utils/supabase/server";
import { MapPin, Star, Building2 } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export const metadata = {
  title: "Annuaire des Cliniques | RDV Santé",
  description: "Recherchez et trouvez la clinique ou le médecin idéal au Sénégal. Prenez rendez-vous en ligne gratuitement.",
};

export default async function CliniquesPage({ searchParams }: { searchParams: { q?: string } }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("cliniques")
    .select("*")
    .neq("statut_abonnement", "suspendu")
    .order("note_moyenne", { ascending: false });

  if (q) {
    // Recherche par nom ou ville
    query = query.or(`nom.ilike.%${q}%,ville.ilike.%${q}%,quartier.ilike.%${q}%`);
  }

  const { data: cliniques, error } = await query;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900 dark:text-white mb-4">
          Annuaire des Cliniques
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
          Découvrez notre réseau de cliniques partenaires à travers le Sénégal et réservez votre consultation en quelques clics.
        </p>
        <SearchBar />
      </div>

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl mb-8 border border-red-200 dark:border-red-800">
          <h3 className="font-bold text-lg mb-2">Erreur de connexion à la base de données</h3>
          <p>Détail de l'erreur : <strong>{error.message}</strong></p>
          <p className="mt-4 text-sm">
            💡 <strong>Rappel :</strong> Avez-vous bien exécuté le script SQL <code>supabase_schema.sql</code> dans l'éditeur SQL de votre tableau de bord Supabase ? Les tables doivent être créées pour que cette page fonctionne.
          </p>
        </div>
      )}

      {(!cliniques || cliniques.length === 0) && !error ? (
        <div className="text-center p-12 glass-card rounded-2xl border-dashed border-2 border-slate-300 dark:border-slate-700">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">Aucune clinique trouvée</h3>
          <p className="text-slate-500 mt-2">Revenez plus tard, notre réseau s'agrandit chaque jour.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cliniques?.map((clinique) => (
            <Link href={`/clinique/${clinique.slug}`} key={clinique.id} className="group flex flex-col h-full glass-card hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                {clinique.photo_url ? (
                  <img src={clinique.photo_url} alt={clinique.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-slate-800 dark:to-slate-900">
                    <Building2 className="w-12 h-12 text-cyan-300 dark:text-cyan-900/50" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{clinique.note_moyenne}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {clinique.nom}
                </h3>
                
                <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin className="w-4 h-4 mt-1 shrink-0 text-blue-500" />
                  <span className="text-sm">{clinique.adresse}, {clinique.quartier} - {clinique.ville}</span>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 flex-1 mb-6">
                  {clinique.description || "Clinique médicale spécialisée offrant des soins de qualité."}
                </p>
                
                <div className="mt-auto flex items-center text-cyan-600 dark:text-cyan-400 font-medium text-sm group-hover:gap-2 transition-all">
                  Voir les disponibilités
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
