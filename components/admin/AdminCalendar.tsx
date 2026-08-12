'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addMonths,
  subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Reservation, ReservationStatus } from '@/types'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

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
  const [selected, setSelected] = useState<Date | null>(new Date())

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

  const selectedEvents = selected ? eventsByDay.get(dayKey(selected)) : undefined

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#0A0A0A] capitalize">
            {format(month, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMonth(startOfMonth(new Date()))
                setSelected(new Date())
              }}
              className="text-xs font-semibold text-gray-500 hover:text-[#E31E24] px-2 transition-colors"
            >
              Aujourd&apos;hui
            </button>
            <button
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400 font-semibold mb-1.5">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const inMonth = isSameMonth(day, month)
            const key = dayKey(day)
            const evts = eventsByDay.get(key)
            const isSelected = !!selected && isSameDay(day, selected)

            return (
              <button
                key={key}
                onClick={() => setSelected(day)}
                className={`aspect-square rounded-lg sm:rounded-xl p-1 sm:p-1.5 flex flex-col items-start justify-between border transition-colors ${
                  inMonth ? 'bg-white' : 'bg-gray-50'
                } ${
                  isSelected
                    ? 'border-[#E31E24] ring-1 ring-[#E31E24]'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <span
                  className={`text-[11px] sm:text-xs ${
                    inMonth ? 'text-[#0A0A0A]' : 'text-gray-300'
                  } ${isToday(day) ? 'font-black' : ''}`}
                >
                  {format(day, 'd')}
                </span>
                {evts && (
                  <div className="flex gap-0.5">
                    {evts.departures.length > 0 && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-green-500"
                        title={`${evts.departures.length} départ(s)`}
                      />
                    )}
                    {evts.returns.length > 0 && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#E31E24]"
                        title={`${evts.returns.length} retour(s)`}
                      />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Départ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E31E24]" /> Retour
          </span>
        </div>
      </div>

      {selected && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h3 className="font-bold text-[#0A0A0A] mb-3 capitalize">
            {format(selected, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>

          {!selectedEvents ||
          (selectedEvents.departures.length === 0 && selectedEvents.returns.length === 0) ? (
            <p className="text-sm text-gray-400">Aucun départ ni retour ce jour-là.</p>
          ) : (
            <div className="space-y-4">
              {selectedEvents.departures.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                    Départs
                  </p>
                  <div className="space-y-2">
                    {selectedEvents.departures.map((r) => (
                      <EventRow key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              )}
              {selectedEvents.returns.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#E31E24] uppercase tracking-wide mb-2">
                    Retours
                  </p>
                  <div className="space-y-2">
                    {selectedEvents.returns.map((r) => (
                      <EventRow key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
