import Link from 'next/link'
import Image from 'next/image'
import { Users, Luggage, Wind, Settings2 } from 'lucide-react'
import type { Car } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils/format'

interface Props {
  car: Car
  startDate?: string
  endDate?: string
  index?: number
}

const FUEL_LABEL: Record<string, string> = {
  essence: 'Essence',
  diesel: 'Diesel',
  hybride: 'Hybride',
  electrique: 'Électrique',
}

const TRANSMISSION_LABEL: Record<string, string> = {
  manual: 'Manuel',
  automatic: 'Automatique',
}

function getBagCount(seats: number) {
  return seats >= 7 ? 5 : seats >= 5 ? 4 : 3
}

export default function CarCard({ car, startDate, endDate }: Props) {
  const href = startDate && endDate
    ? `/voitures/${car.id}?start=${startDate}&end=${endDate}`
    : `/voitures/${car.id}`

  const thumbnail = car.thumbnail_url ?? car.images[0] ?? null
  const hasAC = car.features.includes('climatisation')
  const bags = getBagCount(car.seats)

  return (
    <Link href={href} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300">

        {/* Image paysage */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={car.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2zM13 6l2.5 5H19a1 1 0 011 1v2a1 1 0 01-1 1h-1" />
              </svg>
            </div>
          )}

          {/* Badge catégorie — bas droite */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-white text-[#0A0A0A] text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-sm border-b-2 border-[#E31E24]">
              {CATEGORY_LABELS[car.category]}
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="p-7">
          {/* Nom + catégorie */}
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="font-black text-[#0A0A0A] text-xl leading-tight">{car.name}</h2>
            <span className="text-[10px] text-[#E31E24] font-bold uppercase tracking-wide shrink-0">
              {CATEGORY_LABELS[car.category]}
            </span>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {car.seats} Places
            </span>
            <span className="flex items-center gap-1.5">
              <Luggage className="w-3.5 h-3.5 text-gray-400" />
              {bags} Bagages
            </span>
            {hasAC && (
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-gray-400" />
                Climatisation
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-gray-400" />
              {TRANSMISSION_LABEL[car.transmission]}
            </span>
          </div>

          {/* Carburant + prix */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-[#E31E24] font-semibold">
              {FUEL_LABEL[car.fuel_type]} →
            </span>
            <span className="font-black text-[#0A0A0A] text-2xl">
              {formatPrice(car.price_per_day)}
              <span className="text-sm text-gray-400 font-normal ml-1">/jour</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
