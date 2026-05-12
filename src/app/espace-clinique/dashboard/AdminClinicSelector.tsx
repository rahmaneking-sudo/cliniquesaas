"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function AdminClinicSelector({ 
  cliniques, 
  currentClinicId 
}: { 
  cliniques: any[], 
  currentClinicId?: string 
}) {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = e.target.value;
    if (clinicId) {
      document.cookie = `admin_clinic_id=${clinicId}; path=/`;
      router.refresh();
    } else {
      document.cookie = "admin_clinic_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.refresh();
    }
  };

  return (
    <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 font-bold">
        <Building2 className="w-5 h-5" />
        Mode Super-Admin
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-indigo-100">Inspecter la clinique :</span>
        <select 
          value={currentClinicId || ""}
          onChange={handleSelect}
          className="bg-indigo-700 border border-indigo-500 text-white text-sm rounded-lg focus:ring-indigo-300 focus:border-indigo-300 block w-64 p-2 outline-none"
        >
          <option value="">-- Choisir une clinique --</option>
          {cliniques.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
