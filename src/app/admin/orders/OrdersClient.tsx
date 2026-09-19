'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { toast } from '@/components/ui/Toast'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { Plus, Edit2 } from 'lucide-react'
import type { OrderRequest, OrderStatus } from '@/types'

interface OrdersClientProps {
  initialOrders: OrderRequest[]
  products: { id: string; name: string; sku: string; price: number }[]
}

const statusColors: Record<string, string> = {
  REQUESTED: 'text-dc-muted bg-dc-grey',
  RESERVED: 'text-amber-300 bg-amber-900/40',
  PAYMENT_PENDING: 'text-blue-300 bg-blue-900/40',
  PAID: 'text-dc-lime bg-dc-lime/10',
  CANCELLED: 'text-red-300 bg-red-900/40',
  COMPLETED: 'text-emerald-300 bg-emerald-900/40',
}

const emptyOrder = { customer_name: '', whatsapp_number: '', product_id: '', amount: '', status: 'REQUESTED' as OrderStatus, payment_note: '', payment_reference: '' }

export default function OrdersClient({ initialOrders, products }: OrdersClientProps) {
  const [orders, setOrders] = useState<OrderRequest[]>(initialOrders)
  const [showModal, setShowModal] = useState(false)
  const [editOrder, setEditOrder] = useState<OrderRequest | null>(null)
  const [form, setForm] = useState(emptyOrder)
  const [saving, setSaving] = useState(false)

  const statusOptions = ORDER_STATUSES.map(s => ({ value: s.value, label: s.label }))
  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }))

  const refresh = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('order_requests').select('*, product:products(name,sku)').order('created_at', { ascending: false })
    setOrders((data || []) as OrderRequest[])
  }

  const openAdd = () => {
    setEditOrder(null)
    setForm(emptyOrder)
    setShowModal(true)
  }

  const openEdit = (order: OrderRequest) => {
    setEditOrder(order)
    setForm({
      customer_name: order.customer_name,
      whatsapp_number: order.whatsapp_number,
      product_id: order.product_id || '',
      amount: String(order.amount),
      status: order.status,
      payment_note: order.payment_note || '',
      payment_reference: order.payment_reference || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.customer_name || !form.whatsapp_number) {
      toast.error('Customer name and WhatsApp number are required.')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const selectedProduct = products.find(p => p.id === form.product_id)
    const payload = {
      customer_name: form.customer_name,
      whatsapp_number: form.whatsapp_number,
      product_id: form.product_id || null,
      product_sku: selectedProduct?.sku || '',
      product_name: selectedProduct?.name || '',
      amount: Number(form.amount) || 0,
      status: form.status,
      payment_note: form.payment_note || null,
      payment_reference: form.payment_reference || null,
    }

    if (editOrder) {
      await supabase.from('order_requests').update(payload).eq('id', editOrder.id)
      toast.success('Order updated!')
    } else {
      await supabase.from('order_requests').insert(payload)
      toast.success('Order request recorded!')
    }
    setShowModal(false)
    await refresh()
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Order Log</h1>
          <p className="text-dc-muted text-sm mt-1">Manually track WhatsApp order requests.</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> New Order</Button>
      </div>

      <div className="bg-dc-charcoal border border-dc-grey overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-dc-muted text-sm">No orders yet. Record your first WhatsApp order above.</div>
        ) : (
          <table className="w-full text-sm min-w-[750px]">
            <thead>
              <tr className="border-b border-dc-grey">
                {['Customer', 'Product', 'Amount', 'Status', 'Payment Ref', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-dc-grey/50 hover:bg-dc-grey/10 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-dc-cream">{order.customer_name}</p>
                    <p className="text-dc-muted text-xs">{order.whatsapp_number}</p>
                  </td>
                  <td className="px-4 py-3 text-dc-muted">{order.product_name || '—'}</td>
                  <td className="px-4 py-3 text-dc-cream font-semibold">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${statusColors[order.status] || 'text-dc-muted bg-dc-grey'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dc-muted text-xs font-mono">{order.payment_reference || '—'}</td>
                  <td className="px-4 py-3 text-dc-muted text-xs">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(order)} className="text-dc-muted hover:text-dc-lime transition-colors"><Edit2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editOrder ? 'Edit Order' : 'New Order Request'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Customer Name" required value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} />
            <Input label="WhatsApp Number" required value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} placeholder="+91 98765 43210" />
          </div>
          <Select label="Product" value={form.product_id} onChange={e => {
            const p = products.find(p => p.id === e.target.value)
            setForm(f => ({ ...f, product_id: e.target.value, amount: String(p?.price || f.amount) }))
          }} options={productOptions} placeholder="Select product (optional)" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))} options={statusOptions} />
          </div>
          <Input label="Payment Reference / UTR" value={form.payment_reference} onChange={e => setForm(f => ({ ...f, payment_reference: e.target.value }))} placeholder="UTR or transaction ID" />
          <Textarea label="Payment Note" value={form.payment_note} onChange={e => setForm(f => ({ ...f, payment_note: e.target.value }))} rows={2} placeholder="Internal notes about this order…" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>Save Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
