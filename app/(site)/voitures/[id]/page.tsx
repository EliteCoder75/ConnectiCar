import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCarById, checkCarAvailability } from '@/lib/actions/cars'
import { CATEGORY_LABELS, FEATURE_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils/format'
import CarBookingPanel from '@/components/booking/CarBookingPanel'
import CarFeatureBadge from '@/components/cars/CarFeatureBadge'
import { ArrowLeft, Users, Fuel, Settings2, Calendar, CheckCircle2 } from 'lucide-react'

const TRANSMISSION_LABEL = { manual: 'Manuelle', automatic: 'Automatique' }
const FUEL_LABEL = { essence: 'Essence', diesel: 'Diesel', hybride: 'Hybride', electrique: 'Électrique' }

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ start?: string; end?: string }>
}

export default async function CarPage({ params, searchParams }: Props) {
  const { id } = await params
  const { start, end } = await searchParams

  const car = await getCarById(id)
  if (!car) notFound()

  const isAvailable = (start && end)
    ? await checkCarAvailability(id, start, end)
    : true

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href={start && end ? `/?start=${start}&end=${end}` : '/'}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E31E24] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux véhicules
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gauche — infos voiture */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image principale */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
            {car.thumbnail_url ?? car.images[0] ? (
              <Image
                src={car.thumbnail_url ?? car.images[0]}
                alt={car.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2zM13 6l2.5 5H19a1 1 0 011 1v2a1 1 0 01-1 1h-1" />
                </svg>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-[#E31E24] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                {CATEGORY_LABELS[car.category]}
              </span>
            </div>
          </div>

          {/* Galerie */}
          {car.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {car.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={img} alt={`${car.name} - vue ${i + 2}`} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          )}

          {/* Titre et specs */}
          <div>
            <h1 className="text-3xl font-black text-[#0A0A0A] mb-2">{car.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{car.seats} places</span>
              <span className="flex items-center gap-1.5"><Fuel className="w-4 h-4" />{FUEL_LABEL[car.fuel_type]}</span>
              <span className="flex items-center gap-1.5"><Settings2 className="w-4 h-4" />{TRANSMISSION_LABEL[car.transmission]}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Année {car.year}</span>
            </div>
          </div>

          {/* Équipements */}
          {car.features.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0A0A0A] mb-3">Équipements & Options</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <CarFeatureBadge key={f} feature={f} />
                ))}
              </div>
            </div>
          )}

          {/* Prix */}
          <div className="bg-[#F5F5F5] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-[#E31E24]">
                {formatPrice(car.price_per_day)}
                <span className="text-base font-medium text-gray-400 ml-1">/jour</span>
              </div>
              {isAvailable ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Disponible
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Indisponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Droite — panel réservation */}
        <div className="space-y-4">
          <CarBookingPanel
            car={car}
            initialStart={start}
            initialEnd={end}
            isAvailable={isAvailable}
          />
        </div>
      </div>
    </div>
  )
}
