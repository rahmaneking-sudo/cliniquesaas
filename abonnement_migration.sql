-- Ajout de la colonne date_fin_abonnement
ALTER TABLE public.cliniques ADD COLUMN IF NOT EXISTS date_fin_abonnement TIMESTAMP WITH TIME ZONE;

-- Migration des anciennes valeurs vers le nouveau format
UPDATE public.cliniques 
SET statut_abonnement = 'essai_gratuit' 
WHERE statut_abonnement = 'gratuit' OR statut_abonnement IS NULL;

-- On peut optionnellement ajouter 30 jours par défaut aux cliniques existantes
UPDATE public.cliniques 
SET date_fin_abonnement = NOW() + INTERVAL '30 days'
WHERE date_fin_abonnement IS NULL;
