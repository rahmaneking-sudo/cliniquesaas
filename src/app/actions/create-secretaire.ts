"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

interface CreateSecretaireInput {
  email: string;
  password: string;
  clinic_id: string;
}

export async function createSecretaire(input: CreateSecretaireInput) {
  // 1. Vérifier que c'est bien l'admin qui fait la requête
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.email !== "rahmaneking@gmail.com") {
    return { error: "Accès refusé. Seul l'administrateur peut créer des secrétaires." };
  }

  // 2. Vérifier que la clinique existe
  const { data: clinique } = await supabase
    .from("cliniques")
    .select("id, nom")
    .eq("id", input.clinic_id)
    .single();

  if (!clinique) {
    return { error: "Clinique introuvable." };
  }

  // 3. Utiliser le client Admin (Service Role) pour créer l'utilisateur
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true, // Confirme l'email automatiquement
  });

  if (createError) {
    if (createError.message.includes("already been registered")) {
      return { error: "Un compte avec cet email existe déjà." };
    }
    console.error("Erreur création utilisateur:", createError);
    return { error: "Erreur lors de la création du compte : " + createError.message };
  }

  // 4. Lier l'utilisateur à la clinique dans utilisateurs_clinique
  const { error: linkError } = await supabaseAdmin
    .from("utilisateurs_clinique")
    .insert([{
      id: newUser.user.id,
      clinic_id: input.clinic_id,
      role: "secretaire"
    }]);

  if (linkError) {
    // En cas d'échec de liaison, on supprime le compte créé pour éviter un orphelin
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
    console.error("Erreur liaison clinique:", linkError);
    return { error: "Erreur lors de la liaison à la clinique : " + linkError.message };
  }

  return { 
    success: true, 
    cliniqueName: clinique.nom,
    userEmail: input.email
  };
}
