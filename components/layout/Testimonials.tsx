'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Fifi Sousou',
    initials: 'F',
    color: '#16a34a',
    date: 'Il y a 3 mois',
    text: "Agence excellente ! J'ai récupéré la voiture à l'aéroport et l'ai ramenée au même endroit 10 jours plus tard. Merci et à bientôt !",
  },
  {
    name: 'Bensaha Ryma',
    initials: 'B',
    color: '#0891b2',
    date: 'Il y a 3 jours',
    text: "Excellent service ! Voitures impeccables et équipe très professionnelle. Je recommande vivement ConnectiCAR.",
  },
  {
    name: 'Rafik Achiou',
    initials: 'R',
    color: '#7c3aed',
    date: 'Il y a 3 jours',
    text: "Agence excellente ! Des voitures formidables, des prix raisonnables. Merci à vous ConnectiCAR.",
  },
]

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => changeTo((current + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [current])

  function changeTo(i: number) {
    setFading(true)
    setTimeout(() => { setCurrent(i); setFading(false) }, 300)
  }

  const t = TESTIMONIALS[current]

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre */}
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-4">
          Témoignages
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] leading-tight mb-3">
          Nos clients parlent de leur expérience<br className="hidden sm:block" /> de location avec notre agence
        </h2>

        {/* Séparateur */}
        <div className="w-full h-px bg-gray-300 mb-8" />

        {/* Texte témoignage */}
        <div
          className="transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
            &ldquo;{t.text}&rdquo;
          </p>

          {/* Bas : avatar + nom + boutons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ backgroundColor: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-[#0A0A0A] text-sm">{t.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#E31E24] text-[#E31E24]" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">{t.date}</span>
                </div>
              </div>
              <GoogleIcon />
            </div>

            {/* Boutons nav */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => changeTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#E31E24] hover:text-white hover:border-[#E31E24] transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => changeTo((current + 1) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full bg-[#E31E24] flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
