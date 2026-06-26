'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, isBefore, startOfDay, isEqual } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, MapPin, Search, X } from 'lucide-react'
import { toISODate } from '@/lib/utils/dates'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const LOCATIONS = [
  { value: 'aeroport', label: 'Aéroport de Béjaïa · Soumam - Abane Ramdane' },
  { value: 'cite212',  label: 'Cité 212 Logements GMP, Béjaïa 06000' },
]

export default function HeroSearchBar() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const today = startOfDay(new Date())

  // Initialiser depuis l'URL si dates déjà sélectionnées
  const initStart = searchParams.get('start')
  const initEnd   = searchParams.get('end')

  const [location, setLocation] = useState('aeroport')
  const [startDate, setStartDate] = useState<Date | undefined>(
    initStart ? new Date(initStart) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initEnd ? new Date(initEnd) : undefined
  )
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen,   setEndOpen]   = useState(false)
  const [error, setError] = useState('')

  const hasActiveDates = !!(searchParams.get('start') && searchParams.get('end'))

  function handleSearch() {
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner vos dates de livraison et de restitution.')
      return
    }
    if (isBefore(endDate, startDate) || isEqual(endDate, startDate)) {
      setError('La date de restitution doit être après la date de livraison.')
      return
    }
    setError('')
    router.push(`/?start=${toISODate(startDate)}&end=${toISODate(endDate)}#voitures`)
  }

  function handleReset() {
    setStartDate(undefined)
    setEndDate(undefined)
    setError('')
    router.push('/')
  }

  const formatDay = (d: Date) => format(d, 'd MMM yyyy', { locale: fr })

  return (
    <div className="w-full">
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-2">

          {/* ── Lieu ─────────────────────────────────────────── */}
          <div className="flex-1 bg-white hover:bg-gray-50 border border-white/20 rounded-xl px-4 py-3 cursor-pointer transition-colors">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1.5">
              Lieu de livraison & restitution
            </p>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#E31E24] shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-gray-800 text-sm font-medium w-full outline-none cursor-pointer appearance-none truncate"
              >
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-[#1a1a1a] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Date Livraison ───────────────────────────────── */}
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 bg-white hover:bg-gray-50 border border-white/20 rounded-xl px-4 py-3 text-left transition-colors">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1.5">
                  Livraison
                </p>
                <div className="flex items-center gap-2.5">
                  <CalendarIcon className="w-4 h-4 text-[#E31E24] shrink-0" />
                  <span className={`text-sm font-medium ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>
                    {startDate ? formatDay(startDate) : 'Date de départ'}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 bg-white shadow-2xl" align="start">
              <p className="text-xs text-white/40 text-center py-2.5 border-b border-white/10 font-medium">
                Sélectionnez la date de livraison
              </p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(day) => {
                  if (!day) return
                  setStartDate(day)
                  if (endDate && !isBefore(day, endDate)) setEndDate(undefined)
                  setStartOpen(false)
                  setEndOpen(true)
                }}
                disabled={{ before: today }}
                locale={fr}
                className=""
              />
            </PopoverContent>
          </Popover>

          {/* ── Date Restitution ─────────────────────────────── */}
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 bg-white hover:bg-gray-50 border border-white/20 rounded-xl px-4 py-3 text-left transition-colors">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1.5">
                  Restitution
                </p>
                <div className="flex items-center gap-2.5">
                  <CalendarIcon className="w-4 h-4 text-[#E31E24] shrink-0" />
                  <span className={`text-sm font-medium ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>
                    {endDate ? formatDay(endDate) : 'Date de retour'}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 bg-white shadow-2xl" align="start">
              <p className="text-xs text-white/40 text-center py-2.5 border-b border-white/10 font-medium">
                Sélectionnez la date de restitution
              </p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(day) => {
                  if (!day) return
                  setEndDate(day)
                  setEndOpen(false)
                }}
                disabled={startDate
                  ? { before: new Date(startDate.getTime() + 86400000) }
                  : { before: today }
                }
                locale={fr}
                className=""
              />
            </PopoverContent>
          </Popover>

          {/* ── Bouton Rechercher ────────────────────────────── */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2.5 bg-[#E31E24] hover:bg-red-600 active:scale-95 text-white font-black text-sm uppercase tracking-widest px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
            {hasActiveDates && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-xs px-4 py-3 rounded-xl transition-all duration-200"
              >
                <X className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-2 px-2">{error}</p>
        )}
      </div>
    </div>
  )
}
