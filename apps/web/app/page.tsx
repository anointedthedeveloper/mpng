'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'mpng',
  url: 'https://mpng.vercel.app',
  description: 'Free AI-powered image and video editor. Background removal, photo editing, video trimming, upscaling — all in the browser.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  author: { '@type': 'Person', name: 'Anointed the Developer', url: 'https://github.com/anointedthedeveloper' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const features = [
  { title: 'Background Removal', desc: 'AI-powered one-click cutouts', icon: '✂️', color: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20', tag: 'AI' },
  { title: 'Blur Background', desc: 'Portrait bokeh effect', icon: '🌀', color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', tag: 'AI' },
  { title: 'Color Background', desc: 'Solid colors & gradients', icon: '🎨', color: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-500/20', tag: 'AI' },
  { title: 'Crop & Resize', desc: 'Precise image & video crop', icon: '⬛', color: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', tag: 'Edit' },
  { title: 'Filters & Adjust', desc: 'Brightness, contrast, hue', icon: '🔆', color: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', tag: 'Edit' },
  { title: 'Upscale 2× / 4×', desc: 'High-quality resampling', icon: '🔍', color: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', tag: 'Edit' },
  { title: 'Video Trimming', desc: 'Cut clips with timeline', icon: '🎬', color: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/20', tag: 'Video' },
  { title: 'Paste & Drop', desc: 'Ctrl+V or drop anywhere', icon: '📋', color: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-500/20', tag: 'UX' },
  { title: 'Before / After', desc: 'Drag slider to compare', icon: '↔️', color: 'from-teal-500/10 to-teal-500/5', border: 'border-teal-500/20', tag: 'UX' },
]

// Animated demo showing bg removal effect
function HeroDemoCard() {
  const [revealed, setRevealed] = useState(30)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setRevealed(v => {
        const next = v + dir * 0.8
        if (next >= 85) setDir(-1)
        if (next <= 15) setDir(1)
        return next
      })
    }, 16)
    return () => clearInterval(id)
  }, [dir])

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#6C63FF]/10 aspect-[4/3] bg-[#0d0d1a]">
      {/* After: subject on purple gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/40 via-[#0d0d1a] to-[#ec4899]/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-40 rounded-2xl bg-gradient-to-b from-[#6C63FF]/30 to-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center">
          <span className="text-5xl">🧑‍💻</span>
        </div>
      </div>

      {/* Before: original with bg */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - revealed}% 0 0)` }}>
        <div className="absolute inset-0 bg-[#1a1a2e]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #2d1b69 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1a0533 0%, transparent 40%)',
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-40 rounded-2xl bg-gradient-to-b from-purple-900/50 to-purple-900/20 border border-purple-500/20 flex items-center justify-center">
            <span className="text-5xl">🧑‍💻</span>
          </div>
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded text-white/70">Before</span>
      </div>

      {/* Slider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-[0_0_8px_white]" style={{ left: `${revealed}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-xl flex items-center justify-center" style={{ left: `${revealed}%` }}>
        <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
        </svg>
      </div>
      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded text-white/70">After</span>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/60">Background removed · AI-powered</span>
        </div>
      </div>
    </div>
  )
}

// Animated tool preview cards
function ToolPreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-white/30 ml-1">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function FilterPreview() {
  const [brightness, setBrightness] = useState(120)
  useEffect(() => {
    const id = setInterval(() => setBrightness(v => v > 160 ? 80 : v + 1), 40)
    return () => clearInterval(id)
  }, [])
  const pct = ((brightness - 0) / 200) * 100
  return (
    <div className="flex flex-col gap-3">
      <div className="h-20 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-pink-500" style={{ filter: `brightness(${brightness}%)` }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🌅</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-white/40">
          <span>Brightness</span><span className="text-[#8c84ff] font-mono">{brightness}</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-[#6C63FF] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

function TrimPreview() {
  const [pos, setPos] = useState(20)
  useEffect(() => {
    const id = setInterval(() => setPos(v => v >= 70 ? 20 : v + 0.5), 30)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-3">
      <div className="h-16 rounded-xl bg-[#0d0d1a] border border-white/5 relative overflow-hidden flex items-center px-3">
        <div className="flex-1 h-6 rounded bg-white/5 relative overflow-hidden">
          <div className="absolute inset-y-0 left-[15%] right-[25%] bg-[#6C63FF]/30 border-l-2 border-r-2 border-[#6C63FF]" />
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/80" style={{ left: `${pos}%` }} />
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute top-1 bottom-1 w-px bg-white/10" style={{ left: `${i * 5}%` }} />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-white/40">
        <span>0:00</span><span className="text-[#8c84ff]">Trim: 0:03 → 0:08</span><span>0:15</span>
      </div>
    </div>
  )
}

function CropPreview() {
  const [size, setSize] = useState(60)
  useEffect(() => {
    const id = setInterval(() => setSize(v => v >= 90 ? 40 : v + 0.3), 30)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center justify-center h-24">
      <div className="relative w-28 h-20 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-lg overflow-hidden border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-40">🏙️</div>
        <div className="absolute border-2 border-white/80 rounded"
          style={{ top: `${(100-size)/2}%`, left: `${(100-size)/2}%`, width: `${size}%`, height: `${size}%` }}>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#080810] text-white flex flex-col">

        {/* Nav */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0a0a14] border border-[#6C63FF]/30 flex items-center justify-center text-[11px] font-bold shadow-lg shadow-[#6C63FF]/20">
              <span className="text-white">mp</span><span className="text-[#6C63FF]">ng</span>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <Link href="/editor"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#6C63FF] text-xs font-semibold hover:opacity-90 transition shadow-lg shadow-[#6C63FF]/20">
              Open Editor
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="flex-1 px-6 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6C63FF]/25 bg-[#6C63FF]/8 text-[#a09cf7] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
              Free · AI-powered · No installs
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Edit images &<br />
              videos with <span className="text-[#6C63FF]">AI</span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Remove backgrounds, trim videos, crop, upscale, and apply filters — all free in your browser. No account needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/editor"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C63FF] font-semibold text-sm hover:opacity-90 transition shadow-xl shadow-[#6C63FF]/25">
                Start editing free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 font-semibold text-sm text-white/60 hover:text-white hover:border-white/20 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[['10+', 'Tools'], ['0', 'Cost'], ['100%', 'Browser']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-xs text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <HeroDemoCard />
          </div>
        </section>

        {/* Tool previews */}
        <section className="px-6 sm:px-10 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">See it in action</h2>
              <p className="text-white/40 text-sm">Live previews of what mpng can do</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ToolPreviewCard title="Filters & Adjustments">
                <FilterPreview />
              </ToolPreviewCard>
              <ToolPreviewCard title="Video Trimming">
                <TrimPreview />
              </ToolPreviewCard>
              <ToolPreviewCard title="Crop Tool">
                <CropPreview />
              </ToolPreviewCard>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 sm:px-10 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
              <p className="text-white/40 text-sm">Professional tools, zero cost</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((f) => (
                <div key={f.title}
                  className={`rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-5 hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/40">{f.tag}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <p className="text-white/40 text-xs mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 sm:px-10 py-20 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0a0a14] border border-[#6C63FF]/30 flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-xl shadow-[#6C63FF]/10">
              <span className="text-white">mp</span><span className="text-[#6C63FF]">ng</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to edit?</h2>
            <p className="text-white/40 mb-8">No sign up. No downloads. Just open and start.</p>
            <Link href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#6C63FF] font-bold text-base hover:opacity-90 transition shadow-2xl shadow-[#6C63FF]/30">
              Open Editor — It's Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">mp</span><span className="text-[#6C63FF] font-semibold">ng</span>
            <span className="text-white/20">·</span>
            <span>AI-powered media editing</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            <a href="https://github.com/anointedthedeveloper" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">@anointedthedeveloper</a>
          </div>
        </footer>
      </div>
    </>
  )
}
