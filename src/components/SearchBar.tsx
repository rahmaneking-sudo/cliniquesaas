"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cliniques?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/cliniques");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center w-full h-14 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/20 overflow-hidden transition-all">
        <div className="grid place-items-center h-full w-14 text-slate-400">
          <Search className="h-6 w-6" />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-slate-700 dark:text-slate-200 bg-transparent pr-4 font-medium"
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une clinique, une ville, une spécialité..."
        />
        <button type="submit" className="h-full px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-colors">
          Chercher
        </button>
      </div>
    </form>
  );
}
