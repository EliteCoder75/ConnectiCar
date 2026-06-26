'use client'

import { useTransition } from 'react'
import { deleteCar } from '@/lib/actions/cars'

export default function DeleteCarBtn({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return
    startTransition(async () => {
      await deleteCar(id)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? '...' : 'Suppr.'}
    </button>
  )
}
