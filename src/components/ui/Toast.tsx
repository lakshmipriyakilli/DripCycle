'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1A1A1A',
          color: '#F5F1E8',
          border: '1px solid #2A2A2A',
          borderRadius: '0',
          fontFamily: 'inherit',
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.025em',
        },
        success: {
          iconTheme: {
            primary: '#B6FF21',
            secondary: '#070808',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#070808',
          },
        },
      }}
    />
  )
}

export { toast } from 'react-hot-toast'
