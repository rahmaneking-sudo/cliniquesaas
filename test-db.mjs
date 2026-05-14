// Script de diagnostic — exécuter avec: node test-reservations.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bayhbdkazymofnqmbver.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheWhiZGthenltb2ZucW1idmVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUzMjg4MywiZXhwIjoyMDk0MTA4ODgzfQ.yFy15qkb8tTTHRsO_F8EQXuERh1dFIXd3ptuIjFDaBs"
);

// 1. Voir toutes les réservations récentes
const { data: reservations, error } = await supabase
  .from("reservations")
  .select("id, medecin_id, date_rdv, heure_rdv, statut, nom_patient, clinic_id")
  .order("created_at", { ascending: false })
  .limit(20);

console.log("\n=== TOUTES LES RESERVATIONS RÉCENTES ===");
if (error) {
  console.log("ERREUR:", error.message);
} else {
  reservations.forEach((r, i) => {
    console.log(`${i+1}. ${r.nom_patient} | Date: ${r.date_rdv} | Heure: ${r.heure_rdv} | Statut: ${r.statut} | MedecinID: ${r.medecin_id}`);
  });
  console.log(`\nTotal: ${reservations.length} réservations`);
}

// 2. Voir les statuts distincts
const { data: statuts } = await supabase
  .from("reservations")
  .select("statut")
  .limit(100);

const uniqueStatuts = [...new Set(statuts?.map(s => s.statut))];
console.log("\n=== STATUTS EXISTANTS ===");
console.log(uniqueStatuts);

// 3. Voir le médecin baba diop
const { data: medecin } = await supabase
  .from("medecins")
  .select("id, nom, max_patients_par_jour, horaires")
  .eq("nom", "baba diop")
  .single();

console.log("\n=== MEDECIN BABA DIOP ===");
console.log(medecin);
