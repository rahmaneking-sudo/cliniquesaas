"use client";

import { useState } from "react";
import { Search, MapPin, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set("q", specialty);
    if (location) params.set("loc", location);
    router.push(`/cliniques?${params.toString()}`);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto mt-8 glass-card rounded-2xl p-2 md:p-4 flex flex-col md:flex-row items-center gap-4 relative z-10"
    >
      <div className="flex-1 flex items-center bg-white dark:bg-slate-900 rounded-xl px-4 py-3 md:py-4 w-full shadow-inner border border-slate-100 dark:border-slate-800 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
        <Stethoscope className="w-5 h-5 text-cyan-600 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="Spécialité, nom du médecin..." 
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>
      
      <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2"></div>
      
      <div className="flex-1 flex items-center bg-white dark:bg-slate-900 rounded-xl px-4 py-3 md:py-4 w-full shadow-inner border border-slate-100 dark:border-slate-800 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
        <MapPin className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="Quartier ou ville (ex: Dakar, Almadies)" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <button 
        type="submit"
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        <span>Rechercher</span>
      </button>
    </motion.form>
  );
}
