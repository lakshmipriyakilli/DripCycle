import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DripCycle — Premium Thrift Fashion',
    template: '%s | DripCycle',
  },
  description: 'Discover unique pre-loved fashion at DripCycle. Curated thrift finds — premium, sustainable, one-of-one.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dripcycle.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'DripCycle',
    title: 'DripCycle — Premium Thrift Fashion',
    description: 'Discover unique pre-loved fashion at DripCycle. Curated thrift finds — premium, sustainable, one-of-one.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-dc-black text-dc-cream antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
