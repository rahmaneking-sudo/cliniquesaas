"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, FileText, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface ReservationFormProps {
  medecin: {
    id: string;
    nom: string;
    specialite: string;
    cliniques: {
      id: string;
      nom: string;
    };
  };
}

export default function ReservationForm({ medecin }: ReservationFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom_patient: "",
    whatsapp_patient: "",
    date_rdv: "",
    heure_rdv: "",
    motif: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Vérifier si le médecin est absent ce jour-là
    const { data: absences, error: absError } = await supabase
      .from("absences")
      .select("*")
      .eq("medecin_id", medecin.id)
      .lte("date_debut", formData.date_rdv)
      .gte("date_fin", formData.date_rdv);

    if (absError && absError.code !== "42P01") {
      // Ignorer l'erreur si la table n'existe pas encore (fallback)
      console.error(absError);
    }

    if (absences && absences.length > 0) {
      setError(`Désolé, le Dr. ${medecin.nom} est absent(e) à cette date. Veuillez choisir un autre jour.`);
      setLoading(false);
      return;
    }

    // 2. Si pas absent, on enregistre la réservation
    const { error: insertError } = await supabase.from("reservations").insert([
      {
        medecin_id: medecin.id,
        clinic_id: medecin.cliniques.id,
        nom_patient: formData.nom_patient,
        whatsapp_patient: formData.whatsapp_patient,
        whatsapp_contact: formData.whatsapp_patient, // Fallback for now
        date_rdv: formData.date_rdv,
        heure_rdv: formData.heure_rdv,
        motif: formData.motif
      }
    ]);

    if (insertError) {
      setError("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
      console.error(insertError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rendez-vous Confirmé !</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Votre consultation avec le Dr. {medecin.nom} le {formData.date_rdv} à {formData.heure_rdv} a bien été enregistrée auprès de la clinique <strong>{medecin.cliniques.nom}</strong>. La clinique vous contactera en cas de besoin.
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors shadow-md">
            Retour à l'accueil
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Complétez vos informations</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">C'est rapide et gratuit, aucun compte n'est requis.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prénom et Nom</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                required
                value={formData.nom_patient}
                onChange={(e) => setFormData({...formData, nom_patient: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                placeholder="Ex: Abdou Ndiaye"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Numéro WhatsApp</label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="tel" 
                required
                value={formData.whatsapp_patient}
                onChange={(e) => setFormData({...formData, whatsapp_patient: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                placeholder="+221 77 000 00 00"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Utilisé uniquement pour vous notifier de votre RDV.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date souhaitée</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  required
                  value={formData.date_rdv}
                  onChange={(e) => setFormData({...formData, date_rdv: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Heure</label>
              <div className="relative">
                <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="time" 
                  required
                  value={formData.heure_rdv}
                  onChange={(e) => setFormData({...formData, heure_rdv: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Motif de consultation (Optionnel)</label>
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3 top-4 text-slate-400" />
              <textarea 
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all min-h-[100px]"
                placeholder="Décrivez brièvement vos symptômes..."
              />
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Confirmer le rendez-vous"
          )}
        </motion.button>
      </form>
    </div>
  );
}
