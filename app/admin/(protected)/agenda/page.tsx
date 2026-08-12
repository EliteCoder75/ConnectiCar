import { getReservationsAdmin } from '@/lib/actions/reservations'
import AdminCalendar from '@/components/admin/AdminCalendar'

export default async function AgendaPage() {
  const reservations = await getReservationsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Agenda</h1>
        <span className="text-sm text-gray-500">Départs & retours des véhicules</span>
      </div>

      <AdminCalendar reservations={reservations} />
    </div>
  )
}
