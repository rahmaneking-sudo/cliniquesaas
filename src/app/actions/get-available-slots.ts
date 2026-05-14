"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

interface SlotResult {
  slots: string[];         // Créneaux disponibles ["09:00", "09:30", ...]
  totalReserved: number;   // Nombre de RDV déjà pris ce jour
  maxPatients: number | null; // Quota journalier (null = illimité)
  isFull: boolean;         // true si quota atteint
  doctorName: string;
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

export async function getAvailableSlots(
  medecinId: string,
  date: string // format YYYY-MM-DD
): Promise<SlotResult> {
  const supabase = getAdminClient();

  // 1. Récupérer le médecin avec ses horaires et quota
  const { data: medecin, error: medError } = await supabase
    .from("medecins")
    .select("id, nom, horaires, max_patients_par_jour")
    .eq("id", medecinId)
    .single();

  if (medError || !medecin) {
    return { slots: [], totalReserved: 0, maxPatients: null, isFull: false, doctorName: "" };
  }

  // 2. Déterminer le jour de la semaine pour chercher les horaires
  const dateObj = new Date(date + "T00:00:00");
  const joursMap = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const jourSemaine = joursMap[dateObj.getDay()];

  // 3. Vérifier si le médecin travaille ce jour
  const horaires = medecin.horaires as Record<string, { actif: boolean; debut: string; fin: string }> | null;
  
  if (!horaires || !horaires[jourSemaine] || !horaires[jourSemaine].actif) {
    return { 
      slots: [], 
      totalReserved: 0, 
      maxPatients: medecin.max_patients_par_jour, 
      isFull: false, 
      doctorName: medecin.nom 
    };
  }

  const jourConfig = horaires[jourSemaine];

  // 4. Vérifier si le médecin est absent ce jour
  const { data: absences } = await supabase
    .from("absences")
    .select("id")
    .eq("medecin_id", medecinId)
    .lte("date_debut", date)
    .gte("date_fin", date);

  if (absences && absences.length > 0) {
    return { 
      slots: [], 
      totalReserved: 0, 
      maxPatients: medecin.max_patients_par_jour, 
      isFull: false, 
      doctorName: medecin.nom 
    };
  }

  // 5. Générer tous les créneaux de 30 min entre debut et fin
  const allSlots = generateTimeSlots(jourConfig.debut, jourConfig.fin, 30);

  // 6. Récupérer les créneaux déjà pris (actifs uniquement)
  // ⚠️ Utilise le client admin car les patients anonymes ne peuvent pas
  // lire la table reservations (RLS SELECT = secrétaires/admin seulement)
  const { data: reservations } = await supabase
    .from("reservations")
    .select("heure_rdv")
    .eq("medecin_id", medecinId)
    .eq("date_rdv", date)
    .in("statut", ["en_attente", "confirme", "confirmé"]);

  const heuresPrises = new Set(
    (reservations || []).map((r: any) => r.heure_rdv?.substring(0, 5))
  );
  const totalReserved = heuresPrises.size;

  // 7. Vérifier le quota
  const maxPatients = medecin.max_patients_par_jour;
  const isFull = maxPatients !== null && totalReserved >= maxPatients;

  // 8. Filtrer les créneaux disponibles
  // Si aujourd'hui, ne pas montrer les créneaux déjà passés
  const now = new Date();
  const isToday = date === now.toISOString().split("T")[0];

  const availableSlots = isFull ? [] : allSlots.filter((slot) => {
    // Créneau déjà pris
    if (heuresPrises.has(slot)) return false;
    
    // Si aujourd'hui, filtrer les heures passées
    if (isToday) {
      const [h, m] = slot.split(":").map(Number);
      const slotMinutes = h * 60 + m;
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (slotMinutes <= nowMinutes) return false;
    }
    
    return true;
  });

  return {
    slots: availableSlots,
    totalReserved,
    maxPatients,
    isFull,
    doctorName: medecin.nom,
  };
}

/**
 * Génère des créneaux horaires de `interval` minutes entre `start` et `end`
 * Ex: generateTimeSlots("09:00", "12:00", 30) => ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
 */
function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}
