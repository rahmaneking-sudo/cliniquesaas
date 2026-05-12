import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminClinicSelector from "./AdminClinicSelector";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/espace-clinique");
  }

  const isAdmin = user.email === "rahmaneking@gmail.com";
  let cliniques: any[] = [];
  let currentClinicId: string | undefined = undefined;

  if (isAdmin) {
    const { data } = await supabase.from("cliniques").select("id, nom").order("nom");
    cliniques = data || [];
    const cookieStore = await cookies();
    currentClinicId = cookieStore.get("admin_clinic_id")?.value;
  } else {
    // Vérification du statut de la clinique pour les secrétaires
    const { data: uc } = await supabase
      .from("utilisateurs_clinique")
      .select("clinic_id")
      .eq("id", user.id)
      .single();

    if (uc?.clinic_id) {
      const { data: clinic } = await supabase
        .from("cliniques")
        .select("statut_abonnement")
        .eq("id", uc.clinic_id)
        .single();

      if (clinic?.statut_abonnement === "suspendu") {
        return (
          <div className="flex-1 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-lg w-full text-center border border-red-200 dark:border-red-800 shadow-xl">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Abonnement Suspendu</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                L'accès à l'Espace Pro a été restreint car l'abonnement de votre clinique est arrivé à expiration ou a été suspendu. Veuillez contacter l'administration de RDV Santé pour régulariser votre situation.
              </p>
              <form action="/auth/signout" method="post">
                <button type="submit" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        );
      }
    }
  }
  
  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {isAdmin && <AdminClinicSelector cliniques={cliniques} currentClinicId={currentClinicId} />}
      {children}
    </div>
  );
}
