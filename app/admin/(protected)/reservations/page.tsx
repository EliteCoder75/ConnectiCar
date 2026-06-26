import { getReservationsAdmin } from '@/lib/actions/reservations'
import { formatPrice } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/dates'
import ReservationActions from '@/components/admin/ReservationActions'
import type { Reservation, ReservationStatus } from '@/types'

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminée', className: 'bg-gray-100 text-gray-600' },
}

export default async function ReservationsPage() {
  const reservations = await getReservationsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Réservations</h1>
        <span className="text-sm text-gray-500">{reservations.length} au total</span>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm">
          Aucune réservation pour l&apos;instant
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => {
            const statusCfg = STATUS_CONFIG[r.status]
            return (
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Infos client */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-[#0A0A0A]">{r.customer_name}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <a href={`tel:${r.customer_phone}`} className="text-sm text-[#E31E24] hover:underline">
                      {r.customer_phone}
                    </a>
                    {r.customer_email && (
                      <a href={`mailto:${r.customer_email}`} className="block text-sm text-gray-500 hover:underline">
                        {r.customer_email}
                      </a>
                    )}
                  </div>

                  {/* Infos réservation */}
                  <div className="text-sm text-gray-600 space-y-1 shrink-0">
                    <p className="font-semibold text-[#0A0A0A]">{r.car?.name}</p>
                    <p>{formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
                    <p className="text-xs text-gray-400">
                      {r.pickup_location} → {r.return_location}
                    </p>
                    {r.total_price && (
                      <p className="font-black text-[#E31E24]">{formatPrice(r.total_price)}</p>
                    )}
                  </div>
                </div>

                {r.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Note client : </span>{r.notes}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <ReservationActions
                    id={r.id}
                    status={r.status}
                    pricePerDay={r.price_snapshot ?? r.car?.price_per_day ?? 0}
                    currentStart={r.start_date}
                    currentEnd={r.end_date}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
