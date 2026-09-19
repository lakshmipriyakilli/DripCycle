'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, Tag, Layers, Home,
  FileText, ShoppingBag, Settings, LogOut, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/collections', label: 'Collections', icon: Layers },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && !(exact && pathname !== href)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-56 bg-dc-charcoal border-r border-dc-grey flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-dc-grey flex-shrink-0">
        <Link href="/admin" className="text-xl font-black tracking-[0.15em] uppercase">
          DRIP<span className="text-dc-lime">CYCLE</span>
        </Link>
        <p className="text-[10px] text-dc-muted tracking-widest uppercase mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-150 mb-0.5',
                active
                  ? 'bg-dc-lime/10 text-dc-lime border-l-2 border-dc-lime pl-[10px]'
                  : 'text-dc-muted hover:text-dc-cream hover:bg-dc-grey border-l-2 border-transparent pl-[10px]'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* View store + logout */}
      <div className="px-3 py-4 border-t border-dc-grey space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-dc-muted hover:text-dc-cream transition-colors"
        >
          <ChevronRight size={14} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-dc-muted hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
