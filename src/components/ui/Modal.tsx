'use client'

import { Fragment, type ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full bg-[#0F0F0F] border border-[#2A2A2A] p-6 shadow-2xl',
                  sizes[size],
                  className
                )}
              >
                {title && (
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-lg font-semibold text-[#F5F1E8] uppercase tracking-wider">
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-[#8A8A8A] hover:text-[#F5F1E8] transition-colors p-1"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
                {!title && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#F5F1E8] transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
