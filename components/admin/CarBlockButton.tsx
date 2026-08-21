'use client'

import { useState, useTransition } from 'react'
import { CalendarOff, X, Trash2 } from 'lucide-react'
import { getCarBlocks, createCarBlock, deleteCarBlock } from '@/lib/actions/cars'
import { formatDate } from '@/lib/utils/dates'
import { toast } from 'sonner'
import type { CarBlock } from '@/types'

export default function CarBlockButton({ carId, carName }: { carId: string; carName: string }) {
  const [open, setOpen] = useState(false)
  const [blocks, setBlocks] = useState<CarBlock[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  function openModal() {
    setOpen(true)
    setLoading(true)
    getCarBlocks(carId).then((b) => {
      setBlocks(b)
      setLoading(false)
    })
  }

  function refresh() {
    getCarBlocks(carId).then(setBlocks)
  }

  function handleAdd() {
    if (!start || !end) return
    if (end <= start) {
      toast.error('La date de fin doit être après le début.')
      return
    }
    startTransition(async () => {
      try {
        await createCarBlock(carId, start, end, reason || undefined)
        toast.success('Période bloquée.')
        setStart('')
        setEnd('')
        setReason('')
        refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur lors du blocage.')
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteCarBlock(id, carId)
        toast.success('Blocage supprimé.')
        refresh()
      } catch {
        toast.error('Erreur lors de la suppression.')
      }
    })
  }

  return (
    <>
      <button
        onClick={openModal}
        title="Bloquer des dates"
        className="p-2 text-gray-400 hover:text-[#E31E24] rounded-lg hover:bg-gray-100 transition-colors"
      >
        <CalendarOff className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A0A0A]">Bloquer des dates — {carName}</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Début</label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fin</label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Raison (optionnel)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Entretien, révision..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={isPending || !start || !end}
                className="w-full bg-[#E31E24] text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 text-sm"
              >
                {isPending ? 'Enregistrement...' : 'Bloquer cette période'}
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Périodes bloquées
              </p>
              {loading ? (
                <p className="text-sm text-gray-400">Chargement...</p>
              ) : blocks.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune période bloquée.</p>
              ) : (
                <div className="space-y-2">
                  {blocks.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0A0A0A]">
                          {formatDate(b.start_date)} → {formatDate(b.end_date)}
                        </p>
                        {b.reason && <p className="text-xs text-gray-500 truncate">{b.reason}</p>}
                      </div>
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Supprimer ce blocage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
