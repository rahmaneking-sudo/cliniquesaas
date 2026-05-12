import SearchForm from "@/components/SearchForm";
import { Activity, Clock, ShieldCheck, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-8 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Plus de 50 cliniques partenaires à Dakar
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold font-outfit tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
          Trouvez un médecin et prenez <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            rendez-vous en ligne
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Accédez en temps réel aux disponibilités des meilleurs professionnels de santé au Sénégal. 
          Simple, rapide et sans inscription.
        </p>

        <SearchForm />

        {/* Features minimal */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl opacity-80">
          <div className="flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-cyan-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Gagnez du temps</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Disponibilités en temps réel</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Gratuit</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aucun frais pour le patient</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Activity className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Toutes spécialités</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Médecins généralistes & spécialistes</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Star className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Avis vérifiés</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Notes post-consultation</p>
          </div>
        </div>
      </section>
    </div>
  );
}
