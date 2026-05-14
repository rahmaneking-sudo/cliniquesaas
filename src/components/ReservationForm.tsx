"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { createReservation } from "@/app/actions/create-reservation";
import { getAvailableSlots } from "@/app/actions/get-available-slots";
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
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotInfo, setSlotInfo] = useState<{
    totalReserved: number;
    maxPatients: number | null;
    isFull: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    nom_patient: "",
    whatsapp_patient: "",
    date_rdv: "",
    heure_rdv: "",
    motif: ""
  });

  // Charger les créneaux disponibles quand la date change
  useEffect(() => {
    if (!formData.date_rdv) {
      setAvailableSlots([]);
      setSlotInfo(null);
      setFormData(prev => ({ ...prev, heure_rdv: "" }));
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setFormData(prev => ({ ...prev, heure_rdv: "" }));
      
      const result = await getAvailableSlots(medecin.id, formData.date_rdv);
      setAvailableSlots(result.slots);
      setSlotInfo({
        totalReserved: result.totalReserved,
        maxPatients: result.maxPatients,
        isFull: result.isFull,
      });
      setSlotsLoading(false);
    };

    fetchSlots();
  }, [formData.date_rdv, medecin.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createReservation({
      medecin_id: medecin.id,
      nom_patient: formData.nom_patient,
      whatsapp_patient: formData.whatsapp_patient,
      date_rdv: formData.date_rdv,
      heure_rdv: formData.heure_rdv,
      motif: formData.motif
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  // Date minimum = aujourd'hui
  const today = new Date().toISOString().split("T")[0];

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
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* Nom */}
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

          {/* WhatsApp */}
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date souhaitée</label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="date" 
                required
                min={today}
                value={formData.date_rdv}
                onChange={(e) => setFormData({...formData, date_rdv: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>

          {/* Créneaux horaires */}
          {formData.date_rdv && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Choisissez un créneau
                {slotInfo?.maxPatients && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    ({slotInfo.totalReserved}/{slotInfo.maxPatients} patients inscrits)
                  </span>
                )}
              </label>

              {slotsLoading ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Chargement des disponibilités...
                </div>
              ) : slotInfo?.isFull ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  <strong>Complet !</strong> Le Dr. {medecin.nom} a atteint son nombre maximum de patients pour cette journée 
                  ({slotInfo.maxPatients} patients). Veuillez choisir un autre jour.
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 text-sm">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  Aucun créneau disponible pour cette date. Le médecin ne travaille pas ce jour ou tous les créneaux sont pris.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <motion.button
                      key={slot}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, heure_rdv: slot })}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                        formData.heure_rdv === slot
                          ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/30"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:text-cyan-600"
                      }`}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              )}

              {formData.heure_rdv && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-2"
                >
                  ✓ Créneau sélectionné : {formData.heure_rdv}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Motif */}
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
          disabled={loading || !formData.heure_rdv}
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
