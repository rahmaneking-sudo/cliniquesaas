-- Ajouter la colonne statut à la table réservations
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'confirme';

-- Mettre à jour les anciennes réservations
UPDATE public.reservations SET statut = 'confirme' WHERE statut IS NULL;
