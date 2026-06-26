import { Suspense } from 'react'
import { getCars, getAvailableCars } from '@/lib/actions/cars'
import CarGrid from '@/components/cars/CarGrid'
import HeroSearchBar from '@/components/booking/HeroSearchBar'
import Testimonials from '@/components/layout/Testimonials'
import HowItWorks from '@/components/layout/HowItWorks'
import { Sparkles, Gauge, PlaneTakeoff, Clock } from 'lucide-react'

interface SearchParams {
  start?: string
  end?: string
}

async function CarsSection({ start, end }: { start?: string; end?: string }) {
  const cars = start && end
    ? await getAvailableCars(start, end)
    : await getCars()

  return <CarGrid cars={cars} startDate={start} endDate={end} />
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { start, end } = await searchParams
  const hasSearch = !!(start && end)

  return (
    <div>
      {/* Hero */}
      <section className="relative text-white overflow-hidden min-h-[65vh] flex items-center">
        {/* Photo de fond positionnée sur le bas pour montrer les voitures */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Overlay modéré */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

          {/* Barre de recherche EN HAUT */}
          <div className="animate-fade-up mb-12">
            <Suspense fallback={<div className="h-20 rounded-2xl bg-white/10 animate-pulse" />}>
              <HeroSearchBar />
            </Suspense>
          </div>

          {/* Titre */}
          <div className="animate-fade-up delay-100 mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E31E24] mb-3">
              Location de voitures · Béjaïa & Alger
            </p>
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.95] tracking-tighter">
              <span className="block text-white">Votre mobilité,</span>
              <span className="block text-gradient">notre priorité.</span>
            </h1>
          </div>

          {/* Stats compactes */}
          <div className="animate-fade-up delay-200 flex gap-6">
            {[
              { value: '6+', label: 'Véhicules' },
              { value: '100%', label: 'Automatique' },
              { value: '7j/7', label: 'Disponible' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{s.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <HowItWorks />

      {/* Avantages */}
      <section className="bg-[#0A0A0A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Gauche — points verticaux */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-3">
                Nos avantages
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-10">
                Pourquoi choisir <span className="text-gradient">ConnectiCAR</span> ?
              </h2>

              <div className="space-y-8">
                {[
                  { Icon: Sparkles, title: 'Flotte récente', desc: 'Véhicules 2024/2025 régulièrement renouvelés et parfaitement entretenus.' },
                  { Icon: Gauge, title: 'Boîte automatique', desc: 'Tous nos véhicules sont équipés d\'une boîte automatique pour un confort optimal.' },
                  { Icon: PlaneTakeoff, title: 'Livraison aéroport', desc: 'Prise en charge et retour à l\'aéroport de Béjaïa ou d\'Alger, à votre arrivée ou départ.' },
                  { Icon: Clock, title: 'Disponibles 7j/7', desc: 'Réservation rapide par WhatsApp ou téléphone, réponse garantie sous 24h.' },
                ].map((item, i) => (
                  <div key={item.title} className={`animate-fade-up delay-${i * 100} flex items-start gap-5`}>
                    <div className="w-12 h-12 rounded-2xl bg-[#E31E24]/10 border border-[#E31E24]/20 flex items-center justify-center shrink-0">
                      <item.Icon className="w-5 h-5 text-[#E31E24]" />
                    </div>
                    <div>
                      <h3 className="font-black text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Droite — image + WhatsApp */}
            <div className="flex flex-col gap-5">
              <div className="relative h-[500px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                <img
                  src="/avantages.png"
                  alt="ConnectiCAR — Location de voitures"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Bloc WhatsApp */}
              <a
                href="https://wa.me/213550385419"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-300 rounded-2xl px-6 py-5 group"
              >
                <div>
                  <p className="text-[#25D366] text-sm font-semibold mb-1">Besoin d&apos;aide ?</p>
                  <p className="text-white font-black text-2xl sm:text-3xl tracking-tight">+213 5 50 38 54 19</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-900/30">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Résultats */}
      <section id="voitures" className="w-full px-4 sm:px-8 lg:px-16 py-20">
        {hasSearch ? (
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Résultats</p>
              <h2 className="text-2xl font-black text-[#0A0A0A]">
                Disponible du{' '}
                <span className="text-[#E31E24]">{start}</span>{' '}
                au{' '}
                <span className="text-[#E31E24]">{end}</span>
              </h2>
            </div>
            <a href="/" className="text-sm text-gray-400 hover:text-[#E31E24] transition-colors flex items-center gap-1.5">
              Voir tout →
            </a>
          </div>
        ) : (
          <div className="mb-10 text-center">
            <p className="text-xs text-[#E31E24] uppercase tracking-[0.2em] font-semibold mb-2">Choisissez votre véhicule</p>
            <h2 className="text-4xl font-black text-[#0A0A0A] tracking-tight">
              Notre flotte de voitures
            </h2>
          </div>
        )}

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          }
        >
          <CarsSection start={start} end={end} />
        </Suspense>
      </section>

      {/* Localisation */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31E24] mb-3">Où nous trouver</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">
            Nos zones de service
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Béjaïa & Alger — Livraison à domicile et à l&apos;aéroport</p>
        </div>

        <div className="w-full px-4 sm:px-8">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-[#0A0A0A] px-5 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E31E24] shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">Siège ConnectiCAR</p>
                <p className="text-gray-400 text-xs">Cité 212 logements GMP, Béjaïa 06000</p>
              </div>
            </div>
            <iframe
              src="https://maps.google.com/maps?q=cité+212+logements+GMP+bejaia+06000+Algeria&output=embed&z=15"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ConnectiCAR — Cité 212 logements GMP, Béjaïa"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
