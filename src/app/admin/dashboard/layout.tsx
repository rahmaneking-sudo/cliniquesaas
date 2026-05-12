import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, Building2, CreditCard, Users, LogOut } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== "rahmaneking@gmail.com") {
    redirect("/admin");
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden flex-col md:flex-row">
      
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
        <span className="text-lg font-bold font-outfit">RDV Santé <span className="text-indigo-400">Admin</span></span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>
      </div>

      {/* Sidebar (Desktop only) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold font-outfit text-white">RDV Santé <span className="text-indigo-400">Admin</span></span>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors bg-slate-800/50 text-white font-medium">
              <LayoutDashboard className="w-5 h-5" />
              Vue d'ensemble
            </Link>
            <Link href="/admin/dashboard/cliniques" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
              Cliniques
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors opacity-50 cursor-not-allowed" title="Bientôt disponible">
              <Users className="w-5 h-5" />
              Secrétaires
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors opacity-50 cursor-not-allowed" title="Bientôt disponible">
              <CreditCard className="w-5 h-5" />
              Abonnements
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
