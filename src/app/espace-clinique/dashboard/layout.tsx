import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/espace-clinique");
  }

  // Optionnel : on pourrait vérifier ici si l'utilisateur est bien dans `utilisateurs_clinique`
  // Mais la simple présence du user est déjà suffisante pour accéder au layout
  
  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  );
}
