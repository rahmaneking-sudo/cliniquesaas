-- Script pour donner les droits totaux au Super-Admin
-- Copiez-collez ceci dans l'éditeur SQL de Supabase et cliquez sur RUN

-- Pour les médecins
CREATE POLICY "SuperAdmin bypass medecins" ON medecins
FOR ALL USING (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com');

-- Pour les absences
CREATE POLICY "SuperAdmin bypass absences" ON absences
FOR ALL USING (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com');

-- Pour les cliniques
CREATE POLICY "SuperAdmin bypass cliniques" ON cliniques
FOR ALL USING (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'rahmaneking@gmail.com');

-- Pour les rendez-vous (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'rendez_vous') THEN
        EXECUTE 'CREATE POLICY "SuperAdmin bypass rdv" ON rendez_vous FOR ALL USING (auth.jwt() ->> ''email'' = ''rahmaneking@gmail.com'') WITH CHECK (auth.jwt() ->> ''email'' = ''rahmaneking@gmail.com'')';
    END IF;
END $$;
