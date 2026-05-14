-- ============================================================
-- CORRECTION : Nettoyer les doublons PUIS créer l'index UNIQUE
-- ============================================================

-- ÉTAPE 1 : Marquer les doublons comme "doublon"
-- On garde la plus ancienne réservation (par created_at) pour chaque créneau
WITH doublons AS (
  SELECT id, 
    ROW_NUMBER() OVER (
      PARTITION BY medecin_id, date_rdv, heure_rdv 
      ORDER BY created_at ASC
    ) AS rang
  FROM public.reservations
  WHERE statut IN ('en_attente', 'confirme', 'confirmé')
)
UPDATE public.reservations
SET statut = 'doublon'
WHERE id IN (
  SELECT id FROM doublons WHERE rang > 1
);

-- ÉTAPE 2 : Supprimer l'ancienne contrainte (si elle existe)
ALTER TABLE public.reservations 
DROP CONSTRAINT IF EXISTS unique_creneau_medecin;

-- ÉTAPE 3 : Supprimer l'ancien index partiel (si il existe déjà)
DROP INDEX IF EXISTS unique_creneau_actif;

-- ÉTAPE 4 : Créer l'index UNIQUE partiel avec les BONS statuts
CREATE UNIQUE INDEX unique_creneau_actif
ON public.reservations (medecin_id, date_rdv, heure_rdv)
WHERE statut IN ('en_attente', 'confirme', 'confirmé');

-- ============================================================
-- TERMINÉ ✅
-- ============================================================
