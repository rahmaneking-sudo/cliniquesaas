-- ============================================================
-- MIGRATION : Créneaux uniques + Quota journalier
-- Exécutez dans Supabase SQL Editor
-- ============================================================

-- 1. Ajouter la colonne quota de patients par jour
-- NULL = pas de limite
ALTER TABLE public.medecins 
ADD COLUMN IF NOT EXISTS max_patients_par_jour INTEGER DEFAULT NULL;

-- 2. Contrainte UNIQUE : un seul RDV par médecin + date + heure
-- Empêche au niveau DB que deux patients prennent le même créneau
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_creneau_medecin'
  ) THEN
    ALTER TABLE public.reservations 
    ADD CONSTRAINT unique_creneau_medecin UNIQUE (medecin_id, date_rdv, heure_rdv);
  END IF;
END $$;

-- ============================================================
-- TERMINÉ ✅
-- ============================================================
