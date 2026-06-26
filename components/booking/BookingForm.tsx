'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createReservation } from '@/lib/actions/reservations'
import { calcTotalPrice, formatPrice } from '@/lib/utils/format'
import { calcDurationDays, formatDate } from '@/lib/utils/dates'
import { parseISO } from 'date-fns'
import { PICKUP_LOCATIONS } from '@/types'
import type { Car, PickupLocation } from '@/types'

const schema = z.object({
  customer_name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  customer_phone: z.string().min(9, 'Numéro de téléphone invalide'),
  customer_email: z.string().email('Email invalide').optional().or(z.literal('')),
  pickup_location: z.enum(['Béjaïa', 'Alger', 'Aéroport Béjaïa', 'Aéroport Alger'] as const),
  return_location: z.enum(['Béjaïa', 'Alger', 'Aéroport Béjaïa', 'Aéroport Alger'] as const),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  car: Car
  startDate: string
  endDate: string
}

export default function BookingForm({ car, startDate, endDate }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const days = calcDurationDays(parseISO(startDate), parseISO(endDate))
  const total = calcTotalPrice(car.price_per_day, days)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickup_location: 'Béjaïa',
      return_location: 'Béjaïa',
    },
  })

  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        await createReservation({
          car_id: car.id,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email || undefined,
          start_date: startDate,
          end_date: endDate,
          pickup_location: data.pickup_location as PickupLocation,
          return_location: data.return_location as PickupLocation,
          notes: data.notes || undefined,
          total_price: total,
          price_snapshot: car.price_per_day,
        })
        toast.success('Réservation envoyée ! Nous vous contacterons sous peu.')
        router.push(`/reservation/confirmation?car=${encodeURIComponent(car.name)}&start=${startDate}&end=${endDate}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Récapitulatif */}
      <div className="bg-[#0A0A0A] text-white p-5">
        <h3 className="font-bold text-lg mb-3">Récapitulatif</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Véhicule</span>
            <span className="text-white font-medium">{car.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Départ</span>
            <span className="text-white">{formatDate(startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Retour</span>
            <span className="text-white">{formatDate(endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Durée</span>
            <span className="text-white">{days} jour{days > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarif/jour</span>
            <span className="text-white">{formatPrice(car.price_per_day)}</span>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between items-center">
          <span className="font-semibold">Total estimé</span>
          <span className="text-[#E31E24] font-black text-xl">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <h3 className="font-bold text-[#0A0A0A]">Vos informations</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            {...register('customer_name')}
            placeholder="Prénom et Nom"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
          />
          {errors.customer_name && (
            <p className="text-xs text-red-500 mt-1">{errors.customer_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            {...register('customer_phone')}
            type="tel"
            placeholder="+213 5 50 00 00 00"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
          />
          {errors.customer_phone && (
            <p className="text-xs text-red-500 mt-1">{errors.customer_phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input
            {...register('customer_email')}
            type="email"
            placeholder="votre@email.com"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
          />
          {errors.customer_email && (
            <p className="text-xs text-red-500 mt-1">{errors.customer_email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de prise en charge
            </label>
            <select
              {...register('pickup_location')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] bg-white"
            >
              {PICKUP_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de retour
            </label>
            <select
              {...register('return_location')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] bg-white"
            >
              {PICKUP_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Demandes spéciales <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Siège enfant, heure d'arrivée, etc."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#E31E24] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {isPending ? 'Envoi en cours...' : 'Confirmer la demande'}
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Votre demande sera confirmée par notre équipe sous 24h. Aucun paiement en ligne requis.
        </p>
      </form>
    </div>
  )
}
