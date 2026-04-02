'use client'
import { useEffect, useState, useCallback } from 'react'

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' }

let toastId = 0
const listeners: Set<(t: Toast) => void> = new Set()

export function toast(message: string, type: Toast['type'] = 'info') {
  const t: Toast = { id: ++toastId, message, type }
  listeners.forEach(fn => fn(t))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in pointer-events-auto ${
            t.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' :
            t.type === 'error'   ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300' :
                                   'bg-white/10 border border-white/20 text-white'
          }`}>
          {t.type === 'success' && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.type === 'info' && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  )
}
