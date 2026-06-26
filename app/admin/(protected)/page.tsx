import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import { Car, CalendarCheck, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [carsResult, reservationsResult] = await Promise.all([
    supabase.from('cars').select('id, is_active'),
    supabase.from('reservations').select('id, status, total_price, created_at'),
  ])

  const cars = carsResult.data ?? []
  const reservations = reservationsResult.data ?? []

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthlyRevenue = reservations
    .filter((r) => r.status === 'confirmed' && r.created_at >= monthStart)
    .reduce((sum, r) => sum + (r.total_price ?? 0), 0)

  return {
    total_cars: cars.length,
    active_cars: cars.filter((c) => c.is_active).length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    monthly_revenue: monthlyRevenue,
  }
}

async function getRecentReservations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservations')
    .select('*, car:cars(name)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminée', className: 'bg-gray-100 text-gray-600' },
}

export default async function AdminDashboard() {
  const [stats, recents] = await Promise.all([getStats(), getRecentReservations()])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-[#0A0A0A]">Tableau de bord</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Car, label: 'Véhicules actifs', value: `${stats.active_cars} / ${stats.total_cars}`, color: 'text-[#0A0A0A]' },
          { icon: Clock, label: 'En attente', value: stats.pending, color: 'text-yellow-600' },
          { icon: CheckCircle, label: 'Confirmées', value: stats.confirmed, color: 'text-green-600' },
          { icon: CalendarCheck, label: 'CA ce mois', value: formatPrice(stats.monthly_revenue), color: 'text-[#E31E24]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <stat.icon className="w-5 h-5 text-gray-400 mb-3" />
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Dernières réservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#0A0A0A]">Dernières réservations</h2>
          <Link href="/admin/reservations" className="text-sm text-[#E31E24] hover:underline">
            Voir tout
          </Link>
        </div>
        {recents.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucune réservation pour l&apos;instant</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recents.map((r: any) => {
              const statusCfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG]
              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#0A0A0A] truncate">{r.customer_name}</p>
                    <p className="text-xs text-gray-400 truncate">{r.car?.name} · {r.start_date} → {r.end_date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {r.total_price && (
                      <span className="text-sm font-bold text-[#0A0A0A]">{formatPrice(r.total_price)}</span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
