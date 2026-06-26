import Link from 'next/link'
import { getAllCarsAdmin, toggleCarVisibility } from '@/lib/actions/cars'
import { formatPrice } from '@/lib/utils/format'
import { CATEGORY_LABELS } from '@/types'
import { PlusCircle, Eye, EyeOff, Pencil } from 'lucide-react'
import DeleteCarBtn from '@/components/admin/DeleteCarBtn'

async function ToggleVisibility({ id, isActive }: { id: string; isActive: boolean }) {
  async function toggle() {
    'use server'
    await toggleCarVisibility(id, !isActive)
  }
  return (
    <form action={toggle}>
      <button
        title={isActive ? 'Masquer sur le site' : 'Afficher sur le site'}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </form>
  )
}


export default async function VoituresAdminPage() {
  const cars = await getAllCarsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Voitures</h1>
        <Link
          href="/admin/voitures/nouvelle"
          className="flex items-center gap-2 bg-[#E31E24] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm">
          Aucun véhicule. Commencez par en ajouter un.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Véhicule</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix/jour</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0A0A0A]">{car.name}</div>
                      <div className="text-xs text-gray-400">{car.transmission === 'automatic' ? 'Automatique' : 'Manuelle'} · {car.year}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                        {CATEGORY_LABELS[car.category]}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#E31E24]">
                      {formatPrice(car.price_per_day)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${car.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {car.is_active ? 'En ligne' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <ToggleVisibility id={car.id} isActive={car.is_active} />
                        <Link
                          href={`/admin/voitures/${car.id}`}
                          className="p-2 text-gray-400 hover:text-[#0A0A0A] rounded-lg hover:bg-gray-100 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteCarBtn id={car.id} name={car.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
