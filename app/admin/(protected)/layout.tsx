import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Car, CalendarCheck, LayoutDashboard, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0A0A0A] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-baseline font-black text-xl">
            <span className="text-white">Connecti</span>
            <span className="text-[#E31E24]">CAR</span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">Espace Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Tableau de bord
          </Link>
          <Link
            href="/admin/voitures"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Car className="w-4 h-4" />
            Voitures
          </Link>
          <Link
            href="/admin/reservations"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            Réservations
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2 truncate">{user.email}</p>
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

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
