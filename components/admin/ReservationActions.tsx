'use client'

import { useState, useTransition } from 'react'
import { updateReservationStatus, updateReservationDates } from '@/lib/actions/reservations'
import DateRangePicker from '@/components/booking/DateRangePicker'
import { toISODate, calcDurationDays } from '@/lib/utils/dates'
import { calcTotalPrice, formatPrice } from '@/lib/utils/format'
import type { ReservationStatus, DateRange } from '@/types'
import { toast } from 'sonner'

interface Props {
  id: string
  status: ReservationStatus
  pricePerDay: number
  currentStart: string
  currentEnd: string
}

export default function ReservationActions({ id, status, pricePerDay, currentStart, currentEnd }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showDateEditor, setShowDateEditor] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>()

  const days = range?.from && range?.to ? calcDurationDays(range.from, range.to) : 0
  const newTotal = days > 0 ? calcTotalPrice(pricePerDay, days) : 0

  function handleStatus(newStatus: ReservationStatus) {
    const messages: Record<string, string> = {
      confirmed: 'Confirmer cette réservation ?',
      cancelled: 'Annuler cette réservation ?',
      completed: 'Marquer comme terminée ?',
    }
    if (!confirm(messages[newStatus] ?? 'Continuer ?')) return
    startTransition(async () => {
      try {
        await updateReservationStatus(id, newStatus)
        toast.success('Statut mis à jour.')
      } catch {
        toast.error('Erreur lors de la mise à jour.')
      }
    })
  }

  function handleDateSave() {
    if (!range?.from || !range?.to || days === 0) return
    startTransition(async () => {
      try {
        await updateReservationDates(id, toISODate(range.from), toISODate(range.to), newTotal)
        toast.success('Dates mises à jour.')
        setShowDateEditor(false)
        setRange(undefined)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour.')
      }
    })
  }

  return (
    <div className="space-y-3">
      {/* Boutons d'action selon le statut */}
      <div className="flex gap-2 flex-wrap">
        {status === 'pending' && (
          <>
            <button
              onClick={() => handleStatus('confirmed')}
              disabled={isPending}
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Confirmer
            </button>
            <button
              onClick={() => handleStatus('cancelled')}
              disabled={isPending}
              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <button
              onClick={() => handleStatus('completed')}
              disabled={isPending}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Marquer terminée
            </button>
            <button
              onClick={() => handleStatus('cancelled')}
              disabled={isPending}
              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </>
        )}

        {/* Bouton modifier les dates pour pending et confirmed */}
        {(status === 'pending' || status === 'confirmed') && (
          <button
            onClick={() => setShowDateEditor(!showDateEditor)}
            disabled={isPending}
            className="text-xs bg-[#0A0A0A] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {showDateEditor ? 'Fermer' : '✎ Modifier les dates'}
          </button>
        )}
      </div>

      {/* Éditeur de dates */}
      {showDateEditor && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">
            Dates actuelles : <strong>{currentStart} → {currentEnd}</strong>
          </p>
          <DateRangePicker
            value={range}
            onChange={setRange}
            label="Nouvelles dates"
          />
          {days > 0 && (
            <p className="text-xs text-gray-600">
              {days} jour{days > 1 ? 's' : ''} → nouveau total :{' '}
              <strong className="text-[#E31E24]">{formatPrice(newTotal)}</strong>
            </p>
          )}
          <button
            onClick={handleDateSave}
            disabled={!range?.from || !range?.to || days === 0 || isPending}
            className="w-full text-sm bg-[#E31E24] text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            {isPending ? 'Enregistrement...' : 'Enregistrer les nouvelles dates'}
          </button>
        </div>
      )}
    </div>
  )
}
