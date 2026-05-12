import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RDV Santé | Prenez rendez-vous avec les meilleures cliniques au Sénégal",
  description: "Trouvez un médecin disponible et prenez rendez-vous en ligne gratuitement dans les meilleures cliniques privées de Dakar et du Sénégal.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 pt-16 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
