-- Ce script est la version corrigée pour ajouter uniquement la colonne manquante.
-- Vous pouvez tout copier/coller et faire Run.

ALTER TABLE medecins 
ADD COLUMN IF NOT EXISTS horaires jsonb DEFAULT '{
  "lundi": {"actif": true, "debut": "09:00", "fin": "17:00"},
  "mardi": {"actif": true, "debut": "09:00", "fin": "17:00"},
  "mercredi": {"actif": true, "debut": "09:00", "fin": "17:00"},
  "jeudi": {"actif": true, "debut": "09:00", "fin": "17:00"},
  "vendredi": {"actif": true, "debut": "09:00", "fin": "17:00"},
  "samedi": {"actif": false, "debut": "09:00", "fin": "12:00"},
  "dimanche": {"actif": false, "debut": "00:00", "fin": "00:00"}
}'::jsonb;
