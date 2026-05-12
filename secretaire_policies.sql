-- Script pour autoriser les secrétaires à gérer leurs médecins
-- Copiez-collez ceci dans l'éditeur SQL de Supabase et cliquez sur RUN

-- 1. Autoriser l'insertion d'un médecin par la secrétaire de la même clinique
CREATE POLICY "Secrétaires peuvent ajouter des médecins" ON medecins
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM utilisateurs_clinique WHERE clinic_id = medecins.clinic_id)
);

-- 2. Autoriser la modification (dont les horaires) par la secrétaire
CREATE POLICY "Secrétaires peuvent modifier des médecins" ON medecins
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM utilisateurs_clinique WHERE clinic_id = medecins.clinic_id)
);

-- 3. Autoriser la suppression par la secrétaire
CREATE POLICY "Secrétaires peuvent supprimer des médecins" ON medecins
FOR DELETE USING (
  auth.uid() IN (SELECT id FROM utilisateurs_clinique WHERE clinic_id = medecins.clinic_id)
);
