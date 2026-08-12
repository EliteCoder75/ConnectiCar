'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, CalendarCheck, CalendarDays, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', Icon: LayoutDashboard },
  { href: '/admin/voitures', label: 'Voitures', Icon: Car },
  { href: '/admin/reservations', label: 'Réservations', Icon: CalendarCheck },
  { href: '/admin/agenda', label: 'Agenda', Icon: CalendarDays },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Barre mobile */}
      <div className="sm:hidden flex items-center justify-between bg-[#0A0A0A] text-white px-4 py-3 shrink-0">
        <div className="flex items-baseline font-black text-lg">
          <span className="text-white">Connecti</span>
          <span className="text-[#E31E24]">CAR</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 text-gray-300 hover:text-white"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop mobile */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static inset-y-0 left-0 z-50 w-64 sm:w-56 bg-[#0A0A0A] text-white flex flex-col shrink-0 transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline font-black text-xl">
              <span className="text-white">Connecti</span>
              <span className="text-[#E31E24]">CAR</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Espace Admin</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="sm:hidden p-1 text-gray-400 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2 truncate">{userEmail}</p>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
