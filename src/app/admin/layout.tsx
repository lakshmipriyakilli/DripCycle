import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check auth — if not logged in/not admin, just render children (login page)
  // Middleware handles the redirect for protected routes
  let isAdmin = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      isAdmin = profile?.is_admin === true
    }
  } catch {
    // DB not set up yet or other error
  }

  // If authenticated admin, show with sidebar
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-dc-black">
        <AdminSidebar />
        <div className="ml-56">
          <main className="min-h-screen p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Not authenticated — just render the page (login page)
  return <>{children}</>
}
