import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, CheckCircle, Clock, XCircle, FileEdit, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'

async function getDashboardData() {
  const supabase = await createClient()
  const [statusRes, ordersRes] = await Promise.all([
    supabase.from('products').select('status'),
    supabase.from('order_requests').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const products = statusRes.data || []
  const counts = {
    total: products.length,
    available: products.filter((p) => p.status === 'AVAILABLE').length,
    reserved: products.filter((p) => p.status === 'RESERVED').length,
    sold: products.filter((p) => p.status === 'SOLD').length,
    draft: products.filter((p) => p.status === 'DRAFT').length,
  }

  return { counts, orders: ordersRes.data || [] }
}

export default async function AdminDashboard() {
  const { counts, orders } = await getDashboardData()

  const stats = [
    { label: 'Total Products', value: counts.total, icon: Package, color: 'text-dc-cream' },
    { label: 'Available', value: counts.available, icon: CheckCircle, color: 'text-dc-lime' },
    { label: 'Reserved', value: counts.reserved, icon: Clock, color: 'text-amber-400' },
    { label: 'Sold', value: counts.sold, icon: XCircle, color: 'text-red-400' },
    { label: 'Draft', value: counts.draft, icon: FileEdit, color: 'text-dc-muted' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Dashboard</h1>
          <p className="text-dc-muted text-sm mt-1">Welcome back to DripCycle Admin.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-dc-lime text-dc-black px-5 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-[#a8f010] transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-dc-charcoal border border-dc-grey p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dc-muted text-xs tracking-widest uppercase">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { href: '/admin/products/new', label: 'Add Product', icon: Plus },
          { href: '/admin/products', label: 'Manage Products', icon: Package },
          { href: '/admin/homepage', label: 'Edit Homepage', icon: FileEdit },
          { href: '/admin/orders', label: 'View Orders', icon: ShoppingBag },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-dc-charcoal border border-dc-grey p-4 hover:border-dc-lime hover:text-dc-lime text-dc-muted transition-all duration-200 text-sm font-medium tracking-wide"
          >
            <Icon size={16} className="flex-shrink-0" />
            {label}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream">Recent Order Requests</h2>
          <Link href="/admin/orders" className="text-xs text-dc-lime hover:underline tracking-widest uppercase">
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="bg-dc-charcoal border border-dc-grey p-8 text-center">
            <p className="text-dc-muted text-sm">No order requests yet.</p>
          </div>
        ) : (
          <div className="bg-dc-charcoal border border-dc-grey overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dc-grey">
                  <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium hidden md:table-cell">Product</th>
                  <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-dc-grey/50 hover:bg-dc-grey/20 transition-colors">
                    <td className="px-4 py-3 text-dc-cream">{order.customer_name}</td>
                    <td className="px-4 py-3 text-dc-muted hidden md:table-cell">{order.product_name}</td>
                    <td className="px-4 py-3 text-dc-cream">{formatPrice(order.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold tracking-widest uppercase px-2 py-0.5 ${
                        order.status === 'COMPLETED' ? 'bg-emerald-900/40 text-emerald-300' :
                        order.status === 'PAID' ? 'bg-blue-900/40 text-blue-300' :
                        order.status === 'CANCELLED' ? 'bg-red-900/40 text-red-300' :
                        'bg-dc-grey text-dc-muted'
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-dc-muted text-xs hidden lg:table-cell">{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
