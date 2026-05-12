-- Ajouter la colonne description à la table medecins
ALTER TABLE medecins ADD COLUMN IF NOT EXISTS description text;
