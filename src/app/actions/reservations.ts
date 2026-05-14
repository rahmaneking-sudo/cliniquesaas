"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateReservationStatus(id: string, statut: string) {
  const supabase = await createClient();
  
  // Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Non autorisé" };
  }

  // Déterminer le clinic_id de l'utilisateur pour sécuriser l'opération
  const isAdmin = user.email === "rahmaneking@gmail.com";
  let clinicId: string | null = null;

  if (isAdmin) {
    // L'admin utilise le cookie pour sélectionner la clinique
    const cookieStore = await cookies();
    clinicId = cookieStore.get("admin_clinic_id")?.value || null;
  } else {
    // La secrétaire est liée à sa clinique
    const { data: uc } = await supabase
      .from("utilisateurs_clinique")
      .select("clinic_id")
      .eq("id", user.id)
      .single();
    clinicId = uc?.clinic_id || null;
  }

  if (!clinicId) {
    return { error: "Aucune clinique associée à votre compte." };
  }

  // Sécurisé : on ne peut modifier que les RDV de SA clinique
  const { error } = await supabase
    .from("reservations")
    .update({ statut })
    .eq("id", id)
    .eq("clinic_id", clinicId);

  if (error) {
    console.error("Failed to update reservation status:", error);
    return { error: error.message };
  }

  // Revalidate the dashboard pages so they refresh automatically
  revalidatePath("/espace-clinique/dashboard");
  revalidatePath("/espace-clinique/dashboard/reservations");
  
  return { success: true };
}
