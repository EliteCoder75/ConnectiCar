import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-[#F5F5F5]">
      <AdminSidebar userEmail={user.email ?? ''} />

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  )
}
