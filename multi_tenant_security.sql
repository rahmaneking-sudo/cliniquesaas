-- ============================================================
-- SCRIPT DE SÉCURISATION MULTI-TENANT — RDV Santé
-- Exécutez ce script dans l'éditeur SQL de Supabase (SQL Editor)
-- ⚠️ Ce script est SAFE : il n'efface rien, il ajoute uniquement
-- ============================================================

-- ============================================================
-- 1. RLS POLICIES — Table RESERVATIONS
-- Permet aux secrétaires de voir/modifier uniquement les réservations
-- de leur clinique, et à tout le monde d'insérer (patient public)
-- ============================================================

-- Activer RLS sur reservations (si pas déjà fait)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Lecture : secrétaires voient uniquement les RDV de leur clinique
CREATE POLICY "Secrétaires lisent les réservations de leur clinique"
ON public.reservations FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM utilisateurs_clinique WHERE clinic_id = reservations.clinic_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);

-- Insertion publique : les patients (non-connectés via anon key) peuvent créer des RDV
CREATE POLICY "Insertion publique de réservation"
ON public.reservations FOR INSERT WITH CHECK (true);

-- Mise à jour : uniquement par les secrétaires de la bonne clinique ou l'admin
CREATE POLICY "Secrétaires modifient les réservations de leur clinique"
ON public.reservations FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM utilisateurs_clinique WHERE clinic_id = reservations.clinic_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
) WITH CHECK (
  auth.uid() IN (
    SELECT id FROM utilisateurs_clinique WHERE clinic_id = reservations.clinic_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);

-- Suppression : uniquement par l'admin
CREATE POLICY "Seul l'admin peut supprimer des réservations"
ON public.reservations FOR DELETE USING (
  auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);


-- ============================================================
-- 2. RLS POLICIES — Table ABSENCES
-- ============================================================

-- Activer RLS sur absences (si pas déjà fait)
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Lecture : tout le monde peut lire les absences (nécessaire pour le formulaire patient)
CREATE POLICY "Lecture publique des absences"
ON public.absences FOR SELECT USING (true);

-- Insertion/modification : secrétaires de la même clinique que le médecin
CREATE POLICY "Secrétaires gèrent les absences de leur clinique"
ON public.absences FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT uc.id FROM utilisateurs_clinique uc
    INNER JOIN medecins m ON m.clinic_id = uc.clinic_id
    WHERE m.id = absences.medecin_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);

CREATE POLICY "Secrétaires modifient les absences de leur clinique"
ON public.absences FOR UPDATE USING (
  auth.uid() IN (
    SELECT uc.id FROM utilisateurs_clinique uc
    INNER JOIN medecins m ON m.clinic_id = uc.clinic_id
    WHERE m.id = absences.medecin_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
) WITH CHECK (
  auth.uid() IN (
    SELECT uc.id FROM utilisateurs_clinique uc
    INNER JOIN medecins m ON m.clinic_id = uc.clinic_id
    WHERE m.id = absences.medecin_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);

CREATE POLICY "Secrétaires suppriment les absences de leur clinique"
ON public.absences FOR DELETE USING (
  auth.uid() IN (
    SELECT uc.id FROM utilisateurs_clinique uc
    INNER JOIN medecins m ON m.clinic_id = uc.clinic_id
    WHERE m.id = absences.medecin_id
  )
  OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
);


-- ============================================================
-- 3. TRIGGER — Cohérence medecin_id / clinic_id sur reservations
-- Empêche d'insérer un RDV avec un médecin qui ne fait pas
-- partie de la clinique indiquée
-- ============================================================

CREATE OR REPLACE FUNCTION check_reservation_clinic_coherence()
RETURNS trigger AS $$
BEGIN
  IF (SELECT clinic_id FROM medecins WHERE id = NEW.medecin_id) != NEW.clinic_id THEN
    RAISE EXCEPTION 'Le médecin (%) ne fait pas partie de la clinique (%)', NEW.medecin_id, NEW.clinic_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer le trigger s'il existe déjà (pour pouvoir relancer le script)
DROP TRIGGER IF EXISTS validate_reservation_clinic ON public.reservations;

CREATE TRIGGER validate_reservation_clinic
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION check_reservation_clinic_coherence();


-- ============================================================
-- 4. CONTRAINTES UNIQUE — Slugs
-- ============================================================

-- Unicité globale du slug clinique (URL publique unique)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_clinic_slug'
  ) THEN
    ALTER TABLE public.cliniques ADD CONSTRAINT unique_clinic_slug UNIQUE (slug);
  END IF;
END $$;

-- Unicité du slug médecin PAR clinique (deux cliniques peuvent avoir un "dr-ndiaye")
-- mais pas deux médecins dans la même clinique
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_medecin_slug_per_clinic'
  ) THEN
    ALTER TABLE public.medecins ADD CONSTRAINT unique_medecin_slug_per_clinic UNIQUE (clinic_id, slug);
  END IF;
END $$;


-- ============================================================
-- 5. RLS POLICIES — Table UTILISATEURS_CLINIQUE
-- Sécuriser les opérations de suppression
-- ============================================================

-- S'assurer que RLS est activé
ALTER TABLE public.utilisateurs_clinique ENABLE ROW LEVEL SECURITY;

-- Lecture : les secrétaires peuvent lire leur propre enregistrement, l'admin peut tout lire
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Lecture utilisateurs_clinique' AND tablename = 'utilisateurs_clinique'
  ) THEN
    CREATE POLICY "Lecture utilisateurs_clinique" ON public.utilisateurs_clinique
    FOR SELECT USING (
      auth.uid() = id
      OR auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
    );
  END IF;
END $$;

-- Insertion : seul l'admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin insère utilisateurs_clinique' AND tablename = 'utilisateurs_clinique'
  ) THEN
    CREATE POLICY "Admin insère utilisateurs_clinique" ON public.utilisateurs_clinique
    FOR INSERT WITH CHECK (
      auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
    );
  END IF;
END $$;

-- Suppression : seul l'admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin supprime utilisateurs_clinique' AND tablename = 'utilisateurs_clinique'
  ) THEN
    CREATE POLICY "Admin supprime utilisateurs_clinique" ON public.utilisateurs_clinique
    FOR DELETE USING (
      auth.jwt() ->> 'email' = 'rahmaneking@gmail.com'
    );
  END IF;
END $$;


-- ============================================================
-- TERMINÉ ✅
-- Ce script sécurise l'isolation multi-tenant complète.
-- ============================================================
