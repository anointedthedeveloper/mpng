'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { toast } from '@/components/Toast'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'mpng',
  url: 'https://mpng.vercel.app',
  description:
    'Free AI-powered browser image editor and video editor for background removal, PNG editing, photo editing, video trimming, and upscaling.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  softwareVersion: '1.0',
  browserRequirements: 'Requires JavaScript and a modern web browser',
  author: {
    '@type': 'Person',
    name: 'Anointed the Developer',
    url: 'https://github.com/anointedthedeveloper',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Background removal',
    'Blur background',
    'Color background',
    'Crop and resize',
    'Image adjustment',
    'Sepia filter',
    'Grayscale filter',
    'Invert filter',
    'Image upscaling',
    'Video trimming',
    'PNG export',
    'No install editor',
  ],
}

const featureGroups = [
  {
    title: 'Core edits',
    items: [
      { title: 'Background Removal', desc: 'AI-powered cutouts via remove.bg', tag: 'AI' },
      { title: 'Blur Background', desc: 'Portrait blur with adjustable intensity', tag: 'AI' },
      { title: 'Color Background', desc: 'Solid colors and gradient backgrounds', tag: 'AI' },
      { title: 'Object Removal', desc: 'Erase unwanted objects from an image', tag: 'Edit' },
      { title: 'Blend Layers', desc: 'Combine media with subtle overlay effects', tag: 'Edit' },
      { title: 'Crop & Resize', desc: 'Frame content for any output size', tag: 'Edit' },
    ],
  },
  {
    title: 'Quality tools',
    items: [
      { title: 'Brightness / Contrast', desc: 'Tune exposure and tone in seconds', tag: 'Edit' },
      { title: 'Saturation & Hue', desc: 'Shift mood with color controls', tag: 'Edit' },
      { title: 'Blur Filter', desc: 'Add focus or soften the whole image', tag: 'Edit' },
      { title: 'Sepia', desc: 'Add a warm vintage tone', tag: 'Edit' },
      { title: 'Grayscale', desc: 'Strip color for a monochrome look', tag: 'Edit' },
      { title: 'Invert', desc: 'Flip colors for a bold effect', tag: 'Edit' },
      { title: 'Upscale 2x / 4x', desc: 'Increase resolution for sharper exports', tag: 'Edit' },
      { title: 'Before / After', desc: 'Compare changes with a live slider', tag: 'UX' },
      { title: 'Undo / Redo', desc: 'Move safely through your edit history', tag: 'UX' },
    ],
  },
  {
    title: 'Media workflow',
    items: [
      { title: 'Video Trimming', desc: 'Cut clips with a visual timeline', tag: 'Video' },
      { title: 'Video Crop', desc: 'Crop video frames precisely', tag: 'Video' },
      { title: 'Paste & Drop', desc: 'Use Ctrl+V or drag files straight in', tag: 'UX' },
      { title: 'Download PNG', desc: 'Export transparent images as PNG', tag: 'UX' },
      { title: 'PWA Install', desc: 'Install the no install editor as an app', tag: 'UX' },
      { title: 'Browser First', desc: 'Everything runs in your browser', tag: 'UX' },
    ],
  },
]

const TAG_COLORS: Record<string, string> = {
  AI: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  Edit: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  Video: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  UX: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
}

const PHOTO = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80&auto=format&fit=crop'

function HeroDemoCard() {
  const [pct, setPct] = useState(30)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setPct((value) => {
        const next = value + dir * 0.5
        if (next >= 88) setDir(-1)
        if (next <= 12) setDir(1)
        return next
      })
    }, 16)
    return () => clearInterval(id)
  }, [dir])

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-[#6C63FF]/15 aspect-[4/3] bg-[#0d0d1a] select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,99,255,0.35),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_36%)]" />
      <img src={PHOTO} alt="after" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/45 via-transparent to-[#ec4899]/20 mix-blend-color" />

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <img src={PHOTO} alt="before" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.28em] bg-black/70 px-2 py-1 rounded-full text-white/90">
          Before
        </span>
      </div>

      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" style={{ left: `${pct}%` }} />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center"
        style={{ left: `${pct}%` }}
      >
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
        </svg>
      </div>
      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-[0.28em] bg-black/70 px-2 py-1 rounded-full text-white/90">
        After
      </span>

      <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/70">AI background removal, PNG export, and no install editor workflow</span>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
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
    const id = setInterval(() => setVal((v) => (v >= 180 ? 60 : v + 1)), 35)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="h-24 rounded-xl overflow-hidden relative border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop"
          alt="filter demo"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: `brightness(${val}%) contrast(110%)` }}
        />
      </div>
      {[
        ['Brightness', val, 60, 180],
        ['Contrast', 110, 0, 200],
      ].map(([label, v, min, max]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-white/40">
            <span>{label}</span>
            <span className="text-[#8c84ff] font-mono">{v}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#6C63FF] rounded-full transition-all duration-100"
              style={{
                width: `${(((v as number) - (min as number)) / ((max as number) - (min as number))) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function TrimDemo() {
  const [pos, setPos] = useState(15)

  useEffect(() => {
    const id = setInterval(() => setPos((v) => (v >= 72 ? 15 : v + 0.4)), 25)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="h-14 rounded-xl bg-[#0d0d1a] border border-white/5 relative overflow-hidden flex items-center px-3">
        <div className="flex-1 h-7 rounded bg-white/5 relative overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute top-1 bottom-1 w-px bg-white/10" style={{ left: `${i * 4.2}%` }} />
          ))}
          <div className="absolute inset-y-0 left-[12%] right-[22%] bg-[#6C63FF]/25 border-l-2 border-r-2 border-[#6C63FF]" />
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_4px_white]" style={{ left: `${pos}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-white/35">
        <span>0:00</span>
        <span className="text-[#8c84ff] font-mono">Clip: 0:04 - 0:11</span>
        <span>0:20</span>
      </div>
    </div>
  )
}

function CropDemo() {
  const [s, setS] = useState(55)

  useEffect(() => {
    const id = setInterval(() => setS((v) => (v >= 88 ? 38 : v + 0.25)), 25)
    return () => clearInterval(id)
  }, [])

  const off = (100 - s) / 2

  return (
    <div className="flex items-center justify-center h-28">
      <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=60&auto=format&fit=crop"
          alt="crop demo"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute bg-black/50" style={{ top: 0, left: 0, right: 0, height: `${off}%` }} />
        <div className="absolute bg-black/50" style={{ bottom: 0, left: 0, right: 0, top: `${off + s}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${off}%`, left: 0, width: `${off}%`, height: `${s}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${off}%`, left: `${off + s}%`, right: 0, height: `${s}%` }} />
        <div
          className="absolute border-2 border-white rounded"
          style={{ top: `${off}%`, left: `${off}%`, width: `${s}%`, height: `${s}%` }}
        >
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
    const id = setInterval(() => setIdx((v) => (v + 1) % colors.length), 1200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="h-24 rounded-xl overflow-hidden relative transition-all duration-700 border border-white/5" style={{ background: colors[idx] }}>
        <img
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=60&auto=format&fit=crop"
          alt="bg color demo"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ mixBlendMode: 'luminosity' }}
        />
      </div>
      <div className="flex gap-1.5 justify-center">
        {colors.map((c, i) => (
          <div
            key={c}
            className={`w-4 h-4 rounded-full transition-transform ${i === idx ? 'scale-125 ring-2 ring-white/40' : ''}`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  )
}

function PWAInstallButton() {
  const [prompt, setPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
    }
    const installedHandler = () => {
      setInstalled(true)
      setPrompt(null)
      toast('App installed successfully', 'success')
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  if (installed) return null

  if (!prompt) return null

  return (
    <button
      onClick={async () => {
        prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') {
          setInstalled(true)
          setPrompt(null)
          toast('App installed successfully', 'success')
        } else {
          toast('Install prompt dismissed', 'info')
        }
      }}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#6C63FF]/40 bg-[#6C63FF]/10 text-xs font-semibold text-[#8c84ff] hover:bg-[#6C63FF]/20 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </button>
  )
}

const GH_PATH =
  'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c84ff] mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-white/45 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative min-h-screen bg-[#080810] text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6C63FF]/20 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-[#ec4899]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.18]" />
        </div>

        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#8b5cf6] flex items-center justify-center text-[11px] font-bold shadow-lg shadow-[#6C63FF]/30">
                mp
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-none">
                  mp<span className="text-[#8c84ff]">ng</span>
                </div>
                <div className="text-[11px] text-white/30 mt-1">Browser image editor</div>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <PWAInstallButton />
              <a
                href="https://github.com/anointedthedeveloper/mpng"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={GH_PATH} />
                </svg>
                GitHub
              </a>
              <Link
                href="/editor"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6C63FF] text-xs font-semibold hover:opacity-90 transition shadow-lg shadow-[#6C63FF]/20"
              >
                Open Editor
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </nav>
          </div>
        </header>

        <main className="relative">
          <section className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 pt-14 sm:pt-20 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6C63FF]/25 bg-[#6C63FF]/10 px-3 py-1 text-[11px] font-medium text-[#b8b4ff] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
                Free, browser first, and ready for PNG editing
              </div>
              <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
                Edit images and video with <span className="bg-gradient-to-r from-[#6C63FF] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/50">
                Remove backgrounds, edit PNG files, trim videos, change backgrounds, upscale images, and polish exports in a
                clean browser image editor with no install editor required.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6C63FF] px-6 py-3.5 text-sm font-semibold shadow-2xl shadow-[#6C63FF]/25 transition hover:opacity-90"
                >
                  Start editing free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="https://github.com/anointedthedeveloper/mpng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={GH_PATH} />
                  </svg>
                  View on GitHub
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
                {[
                  ['24+', 'tools'],
                  ['0', 'cost'],
                  ['100%', 'browser'],
                  ['PNG', 'friendly'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 min-w-[120px]">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-white/30 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <HeroDemoCard />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  'Remove background',
                  'Blur background',
                  'Change background color',
                  'Export PNG instantly',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16 border-t border-white/5">
            <SectionHeading
              eyebrow="Live previews"
              title="A compact studio for quick edits"
              description="See the editor do real work before you open it. The interface stays focused on the image, the timeline, and the export path."
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ToolCard title="Filters and adjustments">
                <FilterDemo />
              </ToolCard>
              <ToolCard title="Video trimming">
                <TrimDemo />
              </ToolCard>
              <ToolCard title="Crop tool">
                <CropDemo />
              </ToolCard>
              <ToolCard title="Color background">
                <BgColorDemo />
              </ToolCard>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16 border-t border-white/5">
            <SectionHeading
              eyebrow="Tools"
              title="More tools, clearer grouping, less friction"
              description="The editor now reads like a proper toolkit instead of a few isolated buttons. This makes the browser image editor easier to scan and easier to trust."
            />
            <div className="mt-10 space-y-8">
              {featureGroups.map((group) => (
                <div key={group.title}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white/90">{group.title}</h3>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-white/25">{group.items.length} tools</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.items.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 hover:-translate-y-0.5 hover:border-white/15 transition-transform"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${TAG_COLORS[item.tag]}`}>
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                        <p className="mt-1 text-white/40 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 sm:px-8 py-20 border-t border-white/5">
            <div className="grid gap-4 rounded-[2rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c84ff] mb-3">Why mpng</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Built for fast edits without the setup tax</h2>
                <p className="mt-4 text-white/45 leading-relaxed max-w-2xl">
                  Open the app, drop in an image or video, and keep moving. No install editor. No account wall. No waiting around.
                  That makes it a good fit for quick PNG work, social graphics, and simple video tasks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Transparent PNG export', 'Great for web graphics and stickers'],
                  ['Video trimming', 'Quick cuts with a lightweight timeline'],
                  ['Paste and drop input', 'Works with screenshots and clipboard images'],
                  ['Undo history', 'Change your mind without losing progress'],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-white/40">{copy}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-2xl px-6 sm:px-8 py-20 border-t border-white/5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a14] border border-[#6C63FF]/30 flex items-center justify-center text-sm font-bold mx-auto mb-6 shadow-xl shadow-[#6C63FF]/10">
              <span className="text-white">mp</span>
              <span className="text-[#6C63FF]">ng</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-4">Ready to edit?</h2>
            <p className="text-white/40 mb-8">No sign up. No downloads. Just open the editor and start.</p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6C63FF] px-8 py-4 text-base font-bold shadow-2xl shadow-[#6C63FF]/30 transition hover:opacity-90"
            >
              Open Editor - Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/5 px-6 sm:px-8 py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-white/25">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">mp</span>
              <span className="text-[#6C63FF] font-semibold">ng</span>
              <span className="text-white/20">-</span>
              <span>AI-powered browser image editor</span>
              <span className="text-white/20">-</span>
              <span>Powered by Anobyte</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub
              </a>
              <a href="https://github.com/anointedthedeveloper" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                @anointedthedeveloper
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
