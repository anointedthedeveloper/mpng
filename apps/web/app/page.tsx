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
  { title: 'Background Removal', desc: 'AI-powered one-click cutouts via remove.bg', tag: 'AI', color: 'border-cyan-500/20 bg-cyan-500/5' },
  { title: 'Blur Background', desc: 'Portrait bokeh effect, adjustable intensity', tag: 'AI', color: 'border-blue-500/20 bg-blue-500/5' },
  { title: 'Color Background', desc: 'Solid colors or custom gradients', tag: 'AI', color: 'border-pink-500/20 bg-pink-500/5' },
  { title: 'Crop & Resize', desc: 'Drag handles, aspect ratio presets', tag: 'Edit', color: 'border-violet-500/20 bg-violet-500/5' },
  { title: 'Brightness / Contrast', desc: 'Fine-tune exposure and tone', tag: 'Edit', color: 'border-amber-500/20 bg-amber-500/5' },
  { title: 'Saturation & Hue', desc: 'Color grading controls', tag: 'Edit', color: 'border-orange-500/20 bg-orange-500/5' },
  { title: 'Blur Filter', desc: 'Soften the entire image', tag: 'Edit', color: 'border-sky-500/20 bg-sky-500/5' },
  { title: 'Upscale 2x / 4x', desc: 'High-quality canvas resampling', tag: 'Edit', color: 'border-emerald-500/20 bg-emerald-500/5' },
  { title: 'Video Trimming', desc: 'Cut clips with visual timeline', tag: 'Video', color: 'border-rose-500/20 bg-rose-500/5' },
  { title: 'Video Crop', desc: 'Crop video frames precisely', tag: 'Video', color: 'border-red-500/20 bg-red-500/5' },
  { title: 'Before / After Slider', desc: 'Drag to compare original vs edited', tag: 'UX', color: 'border-teal-500/20 bg-teal-500/5' },
  { title: 'Paste & Drop', desc: 'Ctrl+V or drop anywhere on page', tag: 'UX', color: 'border-indigo-500/20 bg-indigo-500/5' },
  { title: 'Download PNG', desc: 'Export with all filters applied', tag: 'UX', color: 'border-lime-500/20 bg-lime-500/5' },
  { title: 'PWA Install', desc: 'Install as a desktop/mobile app', tag: 'UX', color: 'border-purple-500/20 bg-purple-500/5' },
]

const TAG_COLORS: Record<string, string> = {
  AI: 'text-cyan-400 bg-cyan-500/10',
  Edit: 'text-amber-400 bg-amber-500/10',
  Video: 'text-rose-400 bg-rose-500/10',
  UX: 'text-violet-400 bg-violet-500/10',
}

// Real Unsplash photo — free to use
const PHOTO = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80&auto=format&fit=crop'

function HeroDemoCard() {
  const [pct, setPct] = useState(30)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setPct(v => {
        const next = v + dir * 0.5
        if (next >= 88) setDir(-1)
        if (next <= 12) setDir(1)
        return next
      })
    }, 16)
    return () => clearInterval(id)
  }, [dir])

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#6C63FF]/10 aspect-[4/3] bg-[#0d0d1a] select-none">
      {/* AFTER — real photo with purple tint overlay */}
      <img src={PHOTO} alt="after" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/50 via-transparent to-[#ec4899]/30 mix-blend-color" />

      {/* BEFORE — original photo clipped to left */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <img src={PHOTO} alt="before" className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-black/70 px-2 py-0.5 rounded-md text-white/90">Before</span>
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" style={{ left: `${pct}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center" style={{ left: `${pct}%` }}>
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
        </svg>
      </div>
      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-black/70 px-2 py-0.5 rounded-md text-white/90">After</span>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/70">AI background removal — mpng</span>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-white/30 ml-1">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function FilterDemo() {
  const [val, setVal] = useState(100)
  useEffect(() => {
    const id = setInterval(() => setVal(v => v >= 180 ? 60 : v + 1), 35)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-3">
      <div className="h-24 rounded-xl overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop"
          alt="filter demo" className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: `brightness(${val}%) contrast(${110}%)` }} />
      </div>
      {[['Brightness', val, 60, 180], ['Contrast', 110, 0, 200]].map(([label, v, min, max]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-white/40">
            <span>{label}</span><span className="text-[#8c84ff] font-mono">{v}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-[#6C63FF] rounded-full transition-all duration-100"
              style={{ width: `${(((v as number) - (min as number)) / ((max as number) - (min as number))) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TrimDemo() {
  const [pos, setPos] = useState(15)
  useEffect(() => {
    const id = setInterval(() => setPos(v => v >= 72 ? 15 : v + 0.4), 25)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-3">
      <div className="h-14 rounded-xl bg-[#0d0d1a] border border-white/5 relative overflow-hidden flex items-center px-3">
        <div className="flex-1 h-7 rounded bg-white/5 relative overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="absolute top-1 bottom-1 w-px bg-white/10" style={{ left: `${i * 4.2}%` }} />
          ))}
          <div className="absolute inset-y-0 left-[12%] right-[22%] bg-[#6C63FF]/25 border-l-2 border-r-2 border-[#6C63FF]" />
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_4px_white]" style={{ left: `${pos}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-white/35">
        <span>0:00</span>
        <span className="text-[#8c84ff] font-mono">Clip: 0:04 — 0:11</span>
        <span>0:20</span>
      </div>
    </div>
  )
}

function CropDemo() {
  const [s, setS] = useState(55)
  useEffect(() => {
    const id = setInterval(() => setS(v => v >= 88 ? 38 : v + 0.25), 25)
    return () => clearInterval(id)
  }, [])
  const off = (100 - s) / 2
  return (
    <div className="flex items-center justify-center h-28">
      <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-white/10">
        <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=60&auto=format&fit=crop"
          alt="crop demo" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute bg-black/50" style={{ top: 0, left: 0, right: 0, height: `${off}%` }} />
        <div className="absolute bg-black/50" style={{ bottom: 0, left: 0, right: 0, top: `${off + s}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${off}%`, left: 0, width: `${off}%`, height: `${s}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${off}%`, left: `${off + s}%`, right: 0, height: `${s}%` }} />
        <div className="absolute border-2 border-white rounded"
          style={{ top: `${off}%`, left: `${off}%`, width: `${s}%`, height: `${s}%` }}>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-sm" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-sm" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white rounded-sm" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-sm" />
        </div>
      </div>
    </div>
  )
}

function BgColorDemo() {
  const colors = ['#6C63FF', '#ec4899', '#22c55e', '#f97316', '#3b82f6', '#eab308']
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx(v => (v + 1) % colors.length), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-3">
      <div className="h-24 rounded-xl overflow-hidden relative transition-all duration-700"
        style={{ background: colors[idx] }}>
        <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=60&auto=format&fit=crop"
          alt="bg color demo" className="absolute inset-0 w-full h-full object-cover"
          style={{ mixBlendMode: 'luminosity' }} />
      </div>
      <div className="flex gap-1.5 justify-center">
        {colors.map((c, i) => (
          <div key={c} className={`w-4 h-4 rounded-full transition-transform ${i === idx ? 'scale-125 ring-2 ring-white/40' : ''}`}
            style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

function PWAInstallButton() {
  const [prompt, setPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (installed) return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Installed
    </div>
  )

  if (!prompt) return null

  return (
    <button
      onClick={async () => { prompt.prompt(); const { outcome } = await prompt.userChoice; if (outcome === 'accepted') setInstalled(true) }}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#6C63FF]/40 bg-[#6C63FF]/10 text-xs font-semibold text-[#8c84ff] hover:bg-[#6C63FF]/20 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </button>
  )
}

const GH_PATH = 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'

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
            <PWAInstallButton />
            <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={GH_PATH} /></svg>
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
        <section className="px-6 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6C63FF]/25 bg-[#6C63FF]/8 text-[#a09cf7] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
              Free · AI-powered · No installs
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Edit images &amp;<br />videos with <span className="text-[#6C63FF]">AI</span>
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
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={GH_PATH} /></svg>
                View on GitHub
              </a>
            </div>
            <div className="flex items-center gap-8 mt-8">
              {[['14+', 'Tools'], ['0', 'Cost'], ['100%', 'Browser']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{val}</p>
                  <p className="text-xs text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroDemoCard />
        </section>

        {/* Live demos */}
        <section className="px-6 sm:px-10 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">See it in action</h2>
              <p className="text-white/40 text-sm">Live animated previews — no uploads needed</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ToolCard title="Filters & Adjustments"><FilterDemo /></ToolCard>
              <ToolCard title="Video Trimming"><TrimDemo /></ToolCard>
              <ToolCard title="Crop Tool"><CropDemo /></ToolCard>
              <ToolCard title="Color Background"><BgColorDemo /></ToolCard>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 sm:px-10 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Everything you need</h2>
              <p className="text-white/40 text-sm">14 tools, zero cost, no account</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {features.map((f) => (
                <div key={f.title} className={`rounded-2xl border ${f.color} p-4 hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TAG_COLORS[f.tag]}`}>{f.tag}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 sm:px-10 py-20 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a14] border border-[#6C63FF]/30 flex items-center justify-center text-sm font-bold mx-auto mb-6 shadow-xl shadow-[#6C63FF]/10">
              <span className="text-white">mp</span><span className="text-[#6C63FF]">ng</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to edit?</h2>
            <p className="text-white/40 mb-8">No sign up. No downloads. Just open and start.</p>
            <Link href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#6C63FF] font-bold text-base hover:opacity-90 transition shadow-2xl shadow-[#6C63FF]/30">
              Open Editor — Free
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
