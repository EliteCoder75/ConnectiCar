'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Reservation, ReservationInsert, ReservationStatus } from '@/types'
import { sendAdminNotification, sendClientConfirmation } from '@/lib/email'
import { getCarById } from '@/lib/actions/cars'

export async function createReservation(data: ReservationInsert): Promise<{ id: string }> {
  const supabase = await createClient()

  // Vérifier la disponibilité avant d'insérer
  const { data: available, error: checkError } = await supabase.rpc('is_car_available', {
    p_car_id: data.car_id,
    p_start: data.start_date,
    p_end: data.end_date,
  })

  if (checkError) throw new Error(checkError.message)
  if (!available) throw new Error('Ce véhicule n\'est plus disponible pour ces dates.')

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert(data)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // Envoi des emails (non bloquant — une erreur email ne bloque pas la réservation)
  const car = await getCarById(data.car_id)
  console.log('[RESERVATION] car_id:', data.car_id, '→ car found:', !!car)
  if (car) {
    const emailData = {
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      carName: car.name,
      startDate: data.start_date,
      endDate: data.end_date,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      totalPrice: data.total_price ?? 0,
      notes: data.notes,
    }
    const results = await Promise.allSettled([
      sendAdminNotification(emailData),
      sendClientConfirmation(emailData),
    ])
    console.log('[RESERVATION] email results:', results.map(r => r.status))
  }

  revalidatePath('/')
  revalidatePath('/admin/reservations')
  return { id: reservation.id }
}

export async function getReservationsAdmin(): Promise<Reservation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('*, car:cars(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Reservation[]
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<void> {
  const supabase = await createClient()

  const updates: Partial<Reservation> = { status }
  if (status === 'confirmed') {
    updates.confirmed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/reservations')
}

export async function updateAdminNotes(id: string, admin_notes: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reservations')
    .update({ admin_notes })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/reservations')
}

export async function updateReservationDates(
  id: string,
  start_date: string,
  end_date: string,
  total_price: number,
): Promise<void> {
  const supabase = await createClient()

  // Récupérer le car_id pour vérifier la disponibilité
  const { data: resa } = await supabase
    .from('reservations')
    .select('car_id')
    .eq('id', id)
    .single()

  if (!resa) throw new Error('Réservation introuvable.')

  const { data: available } = await supabase.rpc('is_car_available', {
    p_car_id: resa.car_id,
    p_start: start_date,
    p_end: end_date,
    p_exclude_id: id,
  })

  if (!available) throw new Error('Le véhicule n\'est pas disponible sur ces nouvelles dates.')

  const { error } = await supabase
    .from('reservations')
    .update({ start_date, end_date, total_price })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/reservations')
}
