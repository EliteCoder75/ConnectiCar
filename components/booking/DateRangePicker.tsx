'use client'

import { useState } from 'react'
import { format, isBefore, isAfter, isEqual, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DateRange } from '@/types'

interface Props {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  label?: string
  disabled?: boolean
}

type Draft = { from?: Date; to?: Date }

export default function DateRangePicker({ value, onChange, label = 'Choisir les dates', disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(
    value ? { from: value.from, to: value.to } : {}
  )
  const [phase, setPhase] = useState<'from' | 'to'>('from')

  const today = startOfDay(new Date())

  const displayText = value?.from && value?.to
    ? `${format(value.from, 'd MMM yyyy', { locale: fr })} → ${format(value.to, 'd MMM yyyy', { locale: fr })}`
    : label

  const hint = phase === 'from' || !draft.from
    ? '📅 Cliquez sur la date de départ'
    : '📅 Cliquez sur la date de retour'

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setDraft(value ? { from: value.from, to: value.to } : {})
      setPhase('from')
    }
    setOpen(isOpen)
  }

  function confirm(from: Date, to: Date) {
    setDraft({ from, to })
    onChange({ from, to })
    setOpen(false)
    setPhase('from')
  }

  // react-day-picker v10 : onSelect reçoit (newRange, triggerDate, modifiers, event)
  function handleSelect(_newRange: unknown, triggerDate: Date) {
    const day = startOfDay(triggerDate)
    if (isBefore(day, today)) return

    const { from, to } = draft

    // ── Phase FROM : on attend le 1er clic (date de départ) ──────
    if (phase === 'from') {
      setDraft({ from: day, to: undefined })
      setPhase('to')
      return // picker reste ouvert
    }

    // ── Phase TO : on attend le 2e clic (date de retour) ─────────
    if (!from) {
      // Sécurité : pas de from → recommencer
      setDraft({ from: day, to: undefined })
      setPhase('to')
      return
    }

    // Pas encore de sélection complète (from seul)
    if (!to) {
      if (isEqual(day, from) || isBefore(day, from)) {
        // Clic avant ou sur le départ → nouvelle date de départ
        setDraft({ from: day, to: undefined })
        // phase reste 'to', picker reste ouvert
      } else {
        // Date de retour valide → confirmer
        confirm(from, day)
      }
      return
    }

    // ── Sélection complète existante → ajustement en 1 clic ──────
    if (isBefore(day, from) || isEqual(day, from)) {
      // Avant le début → étendre la période vers le passé
      confirm(day, to)
    } else if (isAfter(day, to) || isEqual(day, to)) {
      // Après la fin → étendre la période vers le futur
      confirm(from, day)
    } else {
      // Dans la période → réduire du côté le plus proche
      const midMs = from.getTime() + (to.getTime() - from.getTime()) / 2
      if (day.getTime() <= midMs) {
        confirm(day, to)   // avancer le début
      } else {
        confirm(from, day) // reculer la fin
      }
    }
  }

  // Valeur affichée dans le calendrier
  const calSelected = draft.from && draft.to
    ? { from: draft.from, to: draft.to }
    : draft.from
      ? { from: draft.from, to: draft.from }
      : undefined

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#E31E24]" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <p className="text-xs text-gray-500 text-center py-2.5 border-b border-gray-100 font-medium">
          {hint}
        </p>
        <Calendar
          mode="range"
          selected={calSelected}
          onSelect={handleSelect as any}
          numberOfMonths={2}
          disabled={{ before: today }}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  )
}
