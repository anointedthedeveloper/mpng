'use client'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Bar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setLoading(true)
    setWidth(0)
    const t1 = setTimeout(() => setWidth(70), 50)
    const t2 = setTimeout(() => { setWidth(100) }, 400)
    const t3 = setTimeout(() => { setLoading(false); setWidth(0) }, 700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [pathname, searchParams])

  if (!loading && width === 0) return null

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[9999] transition-all duration-300 ease-out"
      style={{
        width: `${width}%`,
        background: 'linear-gradient(to right, #6C63FF, #a09cf7)',
        boxShadow: '0 0 8px #6C63FF, 0 0 20px #6C63FF80',
        opacity: loading ? 1 : 0,
      }}
    />
  )
}

export default function PageLoader() {
  return (
    <Suspense>
      <Bar />
    </Suspense>
  )
}
