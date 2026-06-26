'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'
import { isDateRangeValid, toISODate, calcDurationDays } from '@/lib/utils/dates'
import { formatPrice, calcTotalPrice } from '@/lib/utils/format'
import DateRangePicker from './DateRangePicker'
import BookingForm from './BookingForm'
import WhatsAppBookingBtn from './WhatsAppBookingBtn'
import type { Car, DateRange } from '@/types'

interface Props {
  car: Car
  initialStart?: string
  initialEnd?: string
  isAvailable?: boolean
}

export default function CarBookingPanel({ car, initialStart, initialEnd, isAvailable = true }: Props) {
  const router = useRouter()

  const [range, setRange] = useState<DateRange | undefined>(
    initialStart && initialEnd
      ? { from: parseISO(initialStart), to: parseISO(initialEnd) }
      : undefined
  )
  const [confirmed, setConfirmed] = useState(!!(initialStart && initialEnd))

  const days = range?.from && range?.to ? calcDurationDays(range.from, range.to) : 0
  const total = days > 0 ? calcTotalPrice(car.price_per_day, days) : 0

  function handleConfirmDates() {
    if (!range?.from || !range?.to) return
    if (!isDateRangeValid(range.from, range.to)) return
    const start = toISODate(range.from)
    const end = toISODate(range.to)
    setConfirmed(true)
    router.push(`/voitures/${car.id}?start=${start}&end=${end}`, { scroll: false })
  }

  function handleChangeDates() {
    setConfirmed(false)
  }

  // Voiture indisponible pour ces dates
  if (confirmed && !isAvailable) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 text-center space-y-4">
        <div className="text-4xl">🚫</div>
        <h3 className="font-bold text-[#0A0A0A]">Véhicule indisponible</h3>
        <p className="text-sm text-gray-500">
          Ce véhicule est déjà réservé pour les dates sélectionnées.
        </p>
        <button
          onClick={handleChangeDates}
          className="w-full bg-[#0A0A0A] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm"
        >
          Choisir d'autres dates
        </button>
        <WhatsAppBookingBtn carName={car.name} />
      </div>
    )
  }

  // Dates confirmées → afficher formulaire + récap
  if (confirmed && range?.from && range?.to) {
    const start = toISODate(range.from)
    const end = toISODate(range.to)
    return (
      <div className="space-y-4">
        {/* Récap dates + prix */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#0A0A0A] text-sm">Votre réservation</h3>
            <button
              onClick={handleChangeDates}
              className="text-xs text-[#E31E24] hover:underline"
            >
              Modifier les dates
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Départ</span>
              <span className="font-semibold text-[#0A0A0A]">
                {range.from.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Retour</span>
              <span className="font-semibold text-[#0A0A0A]">
                {range.to.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
              <span>{days} jour{days > 1 ? 's' : ''} × {formatPrice(car.price_per_day)}</span>
              <span className="font-black text-[#E31E24] text-base">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <BookingForm car={car} startDate={start} endDate={end} />
        <WhatsAppBookingBtn carName={car.name} startDate={start} endDate={end} />
      </div>
    )
  }

  // Pas encore de dates → afficher le sélecteur
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h3 className="font-bold text-[#0A0A0A]">Choisissez vos dates</h3>

      <DateRangePicker
        value={range}
        onChange={setRange}
        label="Date départ → retour"
      />

      {range?.from && range?.to && days > 0 && (
        <div className="bg-gray-50 rounded-xl p-3 text-sm flex justify-between items-center">
          <span className="text-gray-600">{days} jour{days > 1 ? 's' : ''}</span>
          <span className="font-black text-[#E31E24]">{formatPrice(total)}</span>
        </div>
      )}

      <button
        onClick={handleConfirmDates}
        disabled={!range?.from || !range?.to || days === 0}
        className="w-full bg-[#E31E24] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        Voir la disponibilité & Réserver
      </button>

      <WhatsAppBookingBtn carName={car.name} />
    </div>
  )
}
