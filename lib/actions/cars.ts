'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Car } from '@/types'
import { MOCK_CARS, isMockMode } from '@/lib/mock-data'

export async function getCars(): Promise<Car[]> {
  if (isMockMode()) return MOCK_CARS.filter((c) => c.is_active)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('price_per_day', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAvailableCars(start: string, end: string): Promise<Car[]> {
  if (isMockMode()) return MOCK_CARS.filter((c) => c.is_active)

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_available_cars', {
    p_start: start,
    p_end: end,
  })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCarById(id: string): Promise<Car | null> {
  if (isMockMode()) return MOCK_CARS.find((c) => c.id === id) ?? null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data
}

export async function checkCarAvailability(
  carId: string,
  start: string,
  end: string,
): Promise<boolean> {
  if (isMockMode()) return true

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_car_available', {
    p_car_id: carId,
    p_start: start,
    p_end: end,
  })

  if (error) return true // en cas d'erreur, on laisse passer (géré à l'insertion)
  return data === true
}

// ——— Admin actions (require authenticated session) ———

export async function getAllCarsAdmin(): Promise<Car[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .insert(car)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/voitures')
  return data
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/voitures')
  revalidatePath(`/voitures/${id}`)
  return data
}

export async function deleteCar(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/voitures')
}

export async function toggleCarVisibility(id: string, isActive: boolean): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('cars')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/voitures')
}
