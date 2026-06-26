export type CarCategory = 'economique' | 'confort' | 'suv' | 'premium' | 'luxe'
export type Transmission = 'manual' | 'automatic'
export type FuelType = 'essence' | 'diesel' | 'hybride' | 'electrique'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PickupLocation = 'Béjaïa' | 'Alger' | 'Aéroport Béjaïa' | 'Aéroport Alger'

export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: CarCategory
  transmission: Transmission
  fuel_type: FuelType
  seats: number
  price_per_day: number
  deposit_amount: number | null
  features: string[]
  images: string[]
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  car_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  start_date: string
  end_date: string
  duration_days: number
  pickup_location: PickupLocation
  return_location: PickupLocation
  status: ReservationStatus
  total_price: number | null
  price_snapshot: number | null
  notes: string | null
  admin_notes: string | null
  confirmed_at: string | null
  created_at: string
  updated_at: string
  car?: Car
}

export interface ReservationInsert {
  car_id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  start_date: string
  end_date: string
  pickup_location: PickupLocation
  return_location: PickupLocation
  notes?: string
  total_price: number
  price_snapshot: number
}

export interface DateRange {
  from: Date
  to: Date
}

export const CATEGORY_LABELS: Record<CarCategory, string> = {
  economique: 'Économique',
  confort: 'Confort',
  suv: 'SUV',
  premium: 'Premium',
  luxe: 'Luxe',
}

export const FEATURE_LABELS: Record<string, string> = {
  climatisation: 'Climatisation',
  bluetooth: 'Bluetooth',
  gps: 'GPS',
  camera_recul: 'Caméra de recul',
  camera_360: 'Caméra 360°',
  toit_ouvrant: 'Toit ouvrant',
  sieges_chauffants: 'Sièges chauffants',
  massage_sieges: 'Massage sièges',
  abs: 'ABS',
  esp: 'ESP',
  aide_stationnement: 'Aide au stationnement',
  pack_sport: 'Pack Sport',
}

export const PICKUP_LOCATIONS: PickupLocation[] = [
  'Béjaïa',
  'Alger',
  'Aéroport Béjaïa',
  'Aéroport Alger',
]
