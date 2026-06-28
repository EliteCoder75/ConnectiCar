import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const TESTIMONIALS = [
  {
    name: 'Fifi Sousou',
    initials: 'F',
    color: '#16a34a',
    date: 'Il y a 3 mois',
    rating: 5,
    text: "Agence excellente ! J'ai récupéré la voiture à l'aéroport et l'ai ramenée au même endroit 10 jours plus tard. Merci et à bientôt !",
  },
  {
    name: 'Bensaha Ryma',
    initials: 'B',
    color: '#0891b2',
    date: 'Il y a 3 jours',
    rating: 5,
    text: "Excellent service ! Voitures impeccables et équipe très professionnelle. Je recommande vivement ConnectiCAR.",
  },
  {
    name: 'Rafik Achiou',
    initials: 'R',
    color: '#7c3aed',
    date: 'Il y a 3 jours',
    rating: 5,
    text: "Agence excellente ! Des voitures formidables, des prix raisonnables. Merci à vous ConnectiCAR.",
  },
  {
    name: 'Karim Meziani',
    initials: 'K',
    color: '#ea580c',
    date: 'Il y a 1 semaine',
    rating: 5,
    text: "Service irréprochable de A à Z. La voiture était propre, récente et bien entretenue. La livraison à l'aéroport de Béjaïa s'est faite à l'heure. Je reviendrai sans hésiter !",
  },
  {
    name: 'Samira Bellal',
    initials: 'S',
    color: '#db2777',
    date: 'Il y a 2 semaines',
    rating: 5,
    text: "J'ai loué un véhicule pour un trajet Béjaïa–Alger. Tout s'est très bien passé, équipe disponible et réactive. Tarifs honnêtes et transparents.",
  },
  {
    name: 'Yacine Oussaid',
    initials: 'Y',
    color: '#0284c7',
    date: 'Il y a 1 mois',
    rating: 5,
    text: "Première expérience avec ConnectiCAR et je suis conquis. Véhicule automatique récent, très confortable. Réservation rapide via WhatsApp. Parfait !",
  },
]

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function TemoignagesPage() {
  return (
    <>
      {/* Hero immersif */}
      <div className="relative bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/temoignage.webp"
            alt="Client satisfait ConnectiCAR"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-4">Avis clients</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-5">
            Ils nous font<br />
            <span className="text-[#E31E24]">confiance</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mb-8">
            Découvrez les avis de nos clients sur leur expérience avec ConnectiCAR à Béjaïa et Alger.
          </p>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 w-fit">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#E31E24] text-[#E31E24]" />
              ))}
            </div>
            <span className="font-black text-white ml-1">5 / 5</span>
            <span className="text-gray-400 text-sm ml-1">sur Google</span>
            <GoogleIcon />
          </div>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Grille des témoignages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {TESTIMONIALS.map((t, i) => (
          <article
            key={t.name}
            className={`animate-fade-up delay-${(i % 6 + 1) * 100} bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5 hover:shadow-md hover:border-gray-200 transition-all duration-300`}
          >
            {/* Icône citation */}
            <Quote className="w-7 h-7 text-[#E31E24]/20 shrink-0" />

            {/* Texte */}
            <p className="text-gray-700 leading-relaxed text-sm flex-1">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Barre rouge */}
            <div className="w-8 h-0.5 bg-[#E31E24] rounded-full" />

            {/* Auteur */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#0A0A0A] text-sm">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-[#E31E24] text-[#E31E24]" />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">{t.date}</span>
                  </div>
                </div>
              </div>
              <GoogleIcon />
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="relative px-8 py-12 sm:py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-3">Rejoignez-les</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Prêt pour votre prochain trajet ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Réservez dès maintenant et rejoignez nos clients satisfaits à Béjaïa et Alger.
          </p>
          <Link
            href="/#voitures"
            className="inline-flex items-center gap-2 bg-[#E31E24] text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/30"
          >
            Voir nos véhicules
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
