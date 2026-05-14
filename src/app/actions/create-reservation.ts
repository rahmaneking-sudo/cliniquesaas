"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

interface ReservationInput {
  medecin_id: string;
  nom_patient: string;
  whatsapp_patient: string;
  date_rdv: string;
  heure_rdv: string;
  motif?: string;
}

// Client admin qui bypass RLS — nécessaire car les patients anonymes
// ne peuvent pas lire les réservations (policy SELECT réservée aux secrétaires)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function createReservation(input: ReservationInput) {
  // Client admin pour les vérifications (bypass RLS sur SELECT reservations)
  const supabaseAdmin = getAdminClient();

  // 1. Récupérer le médecin et son clinic_id côté serveur (sécurisé)
  const { data: medecin, error: medError } = await supabaseAdmin
    .from("medecins")
    .select("id, clinic_id, nom, max_patients_par_jour")
    .eq("id", input.medecin_id)
    .single();

  if (medError || !medecin) {
    return { error: "Médecin introuvable." };
  }

  // 2. Vérifier si le médecin est absent ce jour-là
  const { data: absences } = await supabaseAdmin
    .from("absences")
    .select("*")
    .eq("medecin_id", input.medecin_id)
    .lte("date_debut", input.date_rdv)
    .gte("date_fin", input.date_rdv);

  if (absences && absences.length > 0) {
    return { error: `Désolé, le Dr. ${medecin.nom} est absent(e) à cette date. Veuillez choisir un autre jour.` };
  }

  // 3. Vérifier que le créneau n'est pas déjà pris (actifs seulement)
  // ⚠️ Client admin requis : les patients anonymes ne peuvent pas lire reservations via RLS
  const { data: existingSlot } = await supabaseAdmin
    .from("reservations")
    .select("id")
    .eq("medecin_id", input.medecin_id)
    .eq("date_rdv", input.date_rdv)
    .eq("heure_rdv", input.heure_rdv)
    .in("statut", ["en_attente", "confirme", "confirmé"])
    .limit(1);

  if (existingSlot && existingSlot.length > 0) {
    return { error: `Ce créneau (${input.heure_rdv}) est déjà réservé. Veuillez choisir un autre horaire.` };
  }

  // 4. Vérifier le quota journalier du médecin
  if (medecin.max_patients_par_jour !== null) {
    const { count } = await supabaseAdmin
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("medecin_id", input.medecin_id)
      .eq("date_rdv", input.date_rdv)
      .in("statut", ["en_attente", "confirme", "confirmé"]);

    if (count !== null && count >= medecin.max_patients_par_jour) {
      return { 
        error: `Le Dr. ${medecin.nom} a atteint son nombre maximum de patients pour cette journée (${medecin.max_patients_par_jour} patients). Veuillez choisir un autre jour ou un autre médecin.` 
      };
    }
  }

  // 5. Insérer la réservation avec le clinic_id vérifié côté serveur
  // Utilise le client admin pour que l'insertion soit garantie
  const { error: insertError } = await supabaseAdmin.from("reservations").insert([
    {
      medecin_id: medecin.id,
      clinic_id: medecin.clinic_id, // ✅ Vient de la DB, pas du client
      nom_patient: input.nom_patient,
      whatsapp_patient: input.whatsapp_patient,
      whatsapp_contact: input.whatsapp_patient,
      date_rdv: input.date_rdv,
      heure_rdv: input.heure_rdv,
      motif: input.motif || null,
    },
  ]);

  if (insertError) {
    // Gérer le cas de la contrainte UNIQUE (race condition)
    if (insertError.code === "23505") {
      return { error: `Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez choisir un autre horaire.` };
    }
    console.error("Erreur création réservation:", insertError);
    return { error: "Une erreur est survenue lors de la réservation. Veuillez réessayer." };
  }

  return { success: true, medecinNom: medecin.nom };
}
