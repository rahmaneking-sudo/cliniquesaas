"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReservationStatus(id: string, statut: string) {
  const supabase = await createClient();
  
  // Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Non autorisé" };
  }

  const { error } = await supabase
    .from("reservations")
    .update({ statut })
    .eq("id", id);

  if (error) {
    console.error("Failed to update reservation status:", error);
    return { error: error.message };
  }

  // Revalidate the dashboard pages so they refresh automatically
  revalidatePath("/espace-clinique/dashboard");
  revalidatePath("/espace-clinique/dashboard/reservations");
  
  return { success: true };
}
