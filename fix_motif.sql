-- Ajouter la colonne motif à la table absences
ALTER TABLE absences ADD COLUMN IF NOT EXISTS motif text DEFAULT 'Congés';
