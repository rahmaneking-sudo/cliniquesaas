"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isHome 
        ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10" 
        : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {pathname !== "/" && (
            <button 
              onClick={() => router.back()} 
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className={`text-xl font-outfit font-bold ${isHome ? "text-white" : "text-slate-900 dark:text-white"}`}>
              RDV Santé
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            href="/" 
            className={`transition-colors ${isHome ? "text-white/80 hover:text-white" : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"}`}
          >
            Accueil
          </Link>
          <Link 
            href="/cliniques" 
            className={`transition-colors ${isHome ? "text-white/80 hover:text-white" : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"}`}
          >
            Annuaire
          </Link>
          <Link href="/espace-clinique">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-500 transition-colors"
            >
              Espace Pro
            </motion.button>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen 
            ? <X className={`w-6 h-6 ${isHome ? "text-white" : "text-slate-700 dark:text-slate-300"}`} /> 
            : <Menu className={`w-6 h-6 ${isHome ? "text-white" : "text-slate-700 dark:text-slate-300"}`} />
          }
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden overflow-hidden border-b ${
              isHome 
                ? "bg-slate-950 border-white/10" 
                : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800"
            }`}
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium py-2 border-b ${
                  isHome 
                    ? "text-white/80 border-white/10" 
                    : "text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800/50"
                }`}
              >
                Accueil
              </Link>
              <Link 
                href="/cliniques" 
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium py-2 border-b ${
                  isHome 
                    ? "text-white/80 border-white/10" 
                    : "text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800/50"
                }`}
              >
                Annuaire des cliniques
              </Link>
              <Link 
                href="/espace-clinique"
                onClick={() => setIsOpen(false)}
                className="mt-2"
              >
                <button className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-center shadow-md">
                  Accéder à l&apos;Espace Pro
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
