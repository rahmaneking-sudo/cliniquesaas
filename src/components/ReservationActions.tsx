"use client";

import { useState } from "react";
import { updateReservationStatus } from "@/app/actions/reservations";
import { Loader2 } from "lucide-react";

interface ReservationActionsProps {
  id: string;
  nomPatient: string;
  nomMedecin: string;
  dateRdv: string;
  heureRdv: string;
  whatsappPatient: string;
  cliniqueSlug: string;
  cliniqueNom: string;
}

export default function ReservationActions({
  id,
  nomPatient,
  nomMedecin,
  dateRdv,
  heureRdv,
  whatsappPatient,
  cliniqueSlug,
  cliniqueNom,
}: ReservationActionsProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleTerminer = async () => {
    setLoadingAction("termine");
    await updateReservationStatus(id, "termine");
    setLoadingAction(null);
  };

  const handleReporter = async () => {
    setLoadingAction("reporte");
    
    // 1. Update the status in the database
    await updateReservationStatus(id, "reporte");
    
    // 2. Build the WhatsApp message with the rebooking link
    const dateFormatted = new Date(dateRdv).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const lienClinique = `${siteUrl}/clinique/${cliniqueSlug}`;

    const message = `Bonjour ${nomPatient},\n\nSuite à un imprévu, votre rendez-vous du ${dateFormatted} à ${heureRdv} avec le Dr. ${nomMedecin} à la clinique ${cliniqueNom} doit malheureusement être reporté.\n\nVeuillez choisir une nouvelle date qui vous convient en cliquant ici :\n👉 ${lienClinique}\n\nMerci de votre compréhension.\nL'équipe ${cliniqueNom}`;

    const phoneClean = whatsappPatient?.replace(/\D/g, "") || "";
    const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;
    
    // 3. Open WhatsApp
    window.open(waUrl, "_blank");
    
    setLoadingAction(null);
  };

  return (
    <>
      <button
        onClick={handleReporter}
        disabled={loadingAction !== null}
        className="px-3 py-1.5 text-sm font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
      >
        {loadingAction === "reporte" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Reporter"
        )}
      </button>
      <button
        onClick={handleTerminer}
        disabled={loadingAction !== null}
        className="px-3 py-1.5 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
      >
        {loadingAction === "termine" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Terminer"
        )}
      </button>
    </>
  );
}
