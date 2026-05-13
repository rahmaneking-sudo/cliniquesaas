import Link from "next/link";
import { CalendarCheck, ShieldCheck, Clock, Star, Users, ArrowRight, Phone, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full relative overflow-hidden">

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative w-full bg-slate-950 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-600/20 to-transparent rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-500/10 to-transparent rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

        {/* Senegalese flag accent line */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-500" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-emerald-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                🇸🇳 N°1 de la prise de rendez-vous au Sénégal
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-outfit tracking-tight text-white mb-6 leading-[1.1]">
                Votre santé,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400">
                  notre priorité
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
                Trouvez les meilleurs médecins et spécialistes dans tout le Sénégal.
                Réservez votre consultation en quelques clics — c&apos;est gratuit, rapide et sans inscription.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/cliniques">
                  <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-3 text-lg">
                    <CalendarCheck className="w-6 h-6" />
                    Prendre rendez-vous
                  </button>
                </Link>
                <Link href="/espace-clinique">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-3 text-lg">
                    Espace Pro
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              {/* Trust Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
                  🏥 Médecine Générale
                </span>
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
                  🦷 Dentaire
                </span>
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
                  👶 Pédiatrie
                </span>
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
                  👁️ Ophtalmologie
                </span>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                <Image
                  src="/hero-doctor.png"
                  alt="Docteur sénégalaise dans une clinique moderne à Dakar"
                  width={700}
                  height={500}
                  className="w-full h-[500px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating Card - Rating */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">4.9</p>
                  <p className="text-xs text-slate-500 font-medium">Note moyenne</p>
                </div>
              </div>

              {/* Floating Card - Patients */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">500+</p>
                    <p className="text-xs text-slate-500 font-medium">Patients satisfaits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="w-full bg-white dark:bg-slate-950 py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Comment ça marche</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white mb-4">
              Prenez rendez-vous en <span className="text-emerald-600">3 étapes simples</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Plus besoin de passer des heures au téléphone. Réservez depuis votre canapé, votre bureau ou même depuis le taxi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Cherchez votre médecin</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Parcourez notre annuaire de cliniques partenaires à Dakar, Thiès, Saint-Louis et partout au Sénégal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Choisissez votre créneau</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Sélectionnez la date et l&apos;heure qui vous conviennent le mieux. Les disponibilités sont en temps réel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Confirmez et c&apos;est fait !</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Remplissez vos informations et recevez une confirmation. La clinique gère le reste pour vous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image + Stats */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/patient-family.png"
                  alt="Famille sénégalaise dans une clinique moderne"
                  width={600}
                  height={450}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Stats overlay */}
              <div className="absolute -bottom-8 right-4 md:right-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-black text-emerald-600">98%</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Satisfaction</p>
                  </div>
                  <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">50+</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Cliniques</p>
                  </div>
                  <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">24/7</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Disponible</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Pourquoi nous choisir</p>
              <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white mb-6 leading-tight">
                La santé accessible à tous les Sénégalais
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                RDV Santé connecte les patients aux meilleures cliniques du Sénégal. 
                Fini les longues files d&apos;attente et les appels sans réponse.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">100% Gratuit pour les patients</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucun frais caché. Vous ne payez que votre consultation chez le médecin.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Réservation en moins de 2 minutes</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choisissez votre spécialiste, la date souhaitée, et confirmez. C&apos;est tout !</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Confirmation par WhatsApp</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">La clinique vous contacte directement sur WhatsApp pour valider votre rendez-vous.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Partout au Sénégal</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Dakar, Thiès, Saint-Louis, Ziguinchor... Notre réseau s&apos;agrandit chaque jour.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DOCTOR SPOTLIGHT ==================== */}
      <section className="w-full bg-white dark:bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Nos Professionnels</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white mb-4">
              Des médecins de <span className="text-emerald-600">confiance</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Nos cliniques partenaires regroupent les meilleurs spécialistes du Sénégal, 
              formés dans les plus grandes universités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctor Card */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-500 group">
              <div className="h-64 overflow-hidden">
                <Image
                  src="/doctor-profile.png"
                  alt="Médecin spécialiste sénégalais"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">4.9</span>
                  <span className="text-sm text-slate-500">• Dakar</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dr. Ibrahima Fall</h3>
                <p className="text-emerald-600 text-sm font-medium mb-3">Médecine Générale</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Spécialiste en médecine familiale avec plus de 10 ans d&apos;expérience dans les meilleures cliniques de Dakar.
                </p>
              </div>
            </div>

            {/* Promo Card - CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-[60px]" />
              <div>
                <h3 className="text-2xl font-bold mb-4 leading-tight">Vous êtes professionnel de santé ?</h3>
                <p className="text-emerald-100 leading-relaxed mb-8">
                  Rejoignez le réseau RDV Santé et recevez des patients directement via notre plateforme.
                  Gérez vos rendez-vous, vos horaires et vos absences simplement.
                </p>
              </div>
              <a 
                href="https://wa.me/221777185723?text=Bonjour%2C%20je%20suis%20professionnel%20de%20sant%C3%A9%20et%20je%20souhaite%20inscrire%20ma%20clinique%20sur%20RDV%20Sant%C3%A9.%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20%3F"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Nous contacter
                </button>
              </a>
            </div>

            {/* Testimonial Card */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-lg mb-6">
                  &quot;J&apos;ai pu trouver un pédiatre pour mon fils en 5 minutes. 
                  Plus besoin de faire la queue pendant des heures ! Merci RDV Santé.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                  F
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Fatou Diallo</p>
                  <p className="text-sm text-slate-500">Mère de famille, Dakar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="w-full bg-slate-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-600/20 via-yellow-500/10 to-red-600/20 blur-[120px] rounded-full" />
        </div>

        {/* Senegalese flag accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 flex">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-500" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white mb-6 leading-tight">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez les milliers de Sénégalais qui font confiance à RDV Santé pour gérer leurs rendez-vous médicaux.
          </p>
          <Link href="/cliniques">
            <button className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 text-lg flex items-center gap-3 mx-auto">
              <CalendarCheck className="w-6 h-6" />
              Trouver un médecin maintenant
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
