import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-lg font-outfit font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                RDV Santé
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              La plateforme n°1 de prise de rendez-vous médicaux au Sénégal. Trouvez votre médecin et réservez en ligne 24h/24.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Patients</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/cliniques" className="hover:text-cyan-600 transition-colors">Rechercher un médecin</Link></li>
              <li><Link href="/cliniques" className="hover:text-cyan-600 transition-colors">Toutes les cliniques</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 transition-colors">Comment ça marche ?</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Professionnels</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/espace-clinique" className="hover:text-cyan-600 transition-colors">Connexion Clinique</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 transition-colors">Inscrire votre clinique</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 transition-colors">Tarifs et abonnements</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>Dakar, Sénégal</li>
              <li><a href="https://wa.me/221777185723" className="hover:text-emerald-600 transition-colors">+221 77 718 57 23</a></li>
              <li><a href="tel:+221711696897" className="hover:text-emerald-600 transition-colors">+221 71 169 68 97</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} RDV Santé. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-cyan-600">Mentions légales</Link>
            <Link href="#" className="hover:text-cyan-600">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
