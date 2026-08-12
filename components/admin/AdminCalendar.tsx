'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
  addMonths,
  subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Reservation, ReservationStatus } from '@/types'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
}

interface DayEvents {
  departures: Reservation[]
  returns: Reservation[]
}

function dayKey(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

export default function AdminCalendar({ reservations }: { reservations: Reservation[] }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [modalDay, setModalDay] = useState<Date | null>(null)

  const active = useMemo(
    () => reservations.filter((r) => r.status !== 'cancelled'),
    [reservations],
  )

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DayEvents>()
    for (const r of active) {
      if (!map.has(r.start_date)) map.set(r.start_date, { departures: [], returns: [] })
      map.get(r.start_date)!.departures.push(r)

      if (!map.has(r.end_date)) map.set(r.end_date, { departures: [], returns: [] })
      map.get(r.end_date)!.returns.push(r)
    }
    return map
  }, [active])

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const modalEvents = modalDay ? eventsByDay.get(dayKey(modalDay)) : undefined

  return (
    <div className="max-w-sm">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3.5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#0A0A0A] capitalize">
            {format(month, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMonth(startOfMonth(new Date()))}
              className="text-[10px] font-semibold text-gray-500 hover:text-[#E31E24] px-1.5 transition-colors"
            >
              Aujourd&apos;hui
            </button>
            <button
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-gray-300 font-semibold mb-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day) => {
            const inMonth = isSameMonth(day, month)
            const key = dayKey(day)
            const evts = eventsByDay.get(key)
            const hasEvents = !!evts && (evts.departures.length > 0 || evts.returns.length > 0)

            return (
              <button
                key={key}
                onClick={() => hasEvents && setModalDay(day)}
                className={`aspect-square rounded-md p-0.5 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  hasEvents ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                }`}
              >
                <span
                  className={`text-[10px] leading-none ${
                    inMonth ? 'text-[#0A0A0A]' : 'text-gray-300'
                  } ${isToday(day) ? 'font-black text-[#E31E24]' : ''}`}
                >
                  {format(day, 'd')}
                </span>
                <div className="flex gap-0.5 h-1">
                  {evts && evts.departures.length > 0 && (
                    <span className="w-1 h-1 rounded-full bg-green-500" />
                  )}
                  {evts && evts.returns.length > 0 && (
                    <span className="w-1 h-1 rounded-full bg-[#E31E24]" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Départ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" /> Retour
          </span>
        </div>
      </div>

      {modalDay && modalEvents && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalDay(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A0A0A] text-sm capitalize">
                {format(modalDay, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
              <button
                onClick={() => setModalDay(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {modalEvents.departures.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                    Départs
                  </p>
                  <div className="space-y-2">
                    {modalEvents.departures.map((r) => (
                      <EventRow key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              )}
              {modalEvents.returns.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#E31E24] uppercase tracking-wide mb-2">
                    Retours
                  </p>
                  <div className="space-y-2">
                    {modalEvents.returns.map((r) => (
                      <EventRow key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EventRow({ r }: { r: Reservation }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0A0A0A] truncate">{r.car?.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {r.customer_name} · {r.pickup_location} → {r.return_location} ·{' '}
          <span className="text-gray-400">{STATUS_LABEL[r.status]}</span>
        </p>
      </div>
      <a
        href={`tel:${r.customer_phone}`}
        className="text-xs font-semibold text-[#E31E24] hover:underline shrink-0"
      >
        {r.customer_phone}
      </a>
    </div>
  )
}
