import {
  format,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  addDays,
} from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'd MMMM yyyy', { locale: fr })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd/MM/yyyy')
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function calcDurationDays(start: Date, end: Date): number {
  return differenceInCalendarDays(end, start)
}

export function isDateRangeValid(start: Date, end: Date): boolean {
  return isAfter(end, start)
}

export function getMinEndDate(start: Date): Date {
  return addDays(start, 1)
}

export function getTodayDate(): Date {
  return startOfDay(new Date())
}

export function isDateInPast(date: Date): boolean {
  return isBefore(date, startOfDay(new Date()))
}
