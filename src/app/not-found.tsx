import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dc-black flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-dc-lime text-xs font-semibold tracking-[0.4em] uppercase mb-4">404</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-dc-cream mb-4">
          DRIP NOT FOUND
        </h1>
        <p className="text-dc-muted mb-10 max-w-md mx-auto">
          This piece has moved on. But there are plenty more drips waiting for you.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">BROWSE THE SHOP</Button>
        </Link>
      </div>
    </div>
  )
}
