'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Car } from '@/types'
import CarCard from './CarCard'

interface Props {
  cars: Car[]
  startDate?: string
  endDate?: string
}

const PAGE_SIZE = 3

export default function CarGrid({ cars, startDate, endDate }: Props) {
  const [page, setPage] = useState(0)

  if (cars.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun véhicule disponible</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Essayez d&apos;autres dates ou contactez-nous directement pour vérifier la disponibilité.
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(cars.length / PAGE_SIZE)
  const visible = cars.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {visible.map((car, index) => (
          <CarCard
            key={car.id}
            car={car}
            startDate={startDate}
            endDate={endDate}
            index={index}
          />
        ))}
      </div>

      {/* Navigation carousel */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#E31E24] hover:text-white hover:border-[#E31E24] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === page ? 'w-6 bg-[#E31E24]' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full bg-[#E31E24] flex items-center justify-center text-white hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
