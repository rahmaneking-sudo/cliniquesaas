import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminClinicSelector from "./AdminClinicSelector";

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

  const isAdmin = user.email === "rahmaneking@gmail.com";
  let cliniques: any[] = [];
  let currentClinicId: string | undefined = undefined;

  if (isAdmin) {
    const { data } = await supabase.from("cliniques").select("id, nom").order("nom");
    cliniques = data || [];
    const cookieStore = await cookies();
    currentClinicId = cookieStore.get("admin_clinic_id")?.value;
  }
  
  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {isAdmin && <AdminClinicSelector cliniques={cliniques} currentClinicId={currentClinicId} />}
      {children}
    </div>
  );
}
