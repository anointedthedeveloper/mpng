import Link from 'next/link'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'mpng',
  url: 'https://mpng.vercel.app',
  description:
    'AI-powered image and video editing platform that runs in the browser. Background removal, filters, smart cropping, and video trimming.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  author: {
    '@type': 'Person',
    name: 'Anointed the Developer',
    url: 'https://github.com/anointedthedeveloper',
  },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const features = [
  {
    title: 'Background Removal',
    desc: 'One-click AI cutouts via remove.bg',
    color: 'border-cyan-500/20 hover:border-cyan-500/40',
    iconColor: 'text-cyan-400 bg-cyan-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    title: 'Canvas Editing',
    desc: 'Filters, brightness, contrast, saturation',
    color: 'border-fuchsia-500/20 hover:border-fuchsia-500/40',
    iconColor: 'text-fuchsia-400 bg-fuchsia-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M19.79 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    title: 'Upscale & Export',
    desc: '2× / 4× upscaling, download as PNG',
    color: 'border-amber-500/20 hover:border-amber-500/40',
    iconColor: 'text-amber-400 bg-amber-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    title: 'Blur Background',
    desc: 'Portrait-style bokeh effect, adjustable',
    color: 'border-blue-500/20 hover:border-blue-500/40',
    iconColor: 'text-blue-400 bg-blue-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" strokeWidth="1.5"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
  },
  {
    title: 'Color Background',
    desc: 'Solid colors or gradients behind subject',
    color: 'border-pink-500/20 hover:border-pink-500/40',
    iconColor: 'text-pink-400 bg-pink-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'Paste & Drop',
    desc: 'Ctrl+V or drop anywhere to upload',
    color: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconColor: 'text-emerald-400 bg-emerald-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#080810] text-white flex flex-col">

        {/* Nav */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C63FF] flex items-center justify-center text-xs font-bold shadow-lg shadow-[#6C63FF]/30">
              mp
            </div>
            <span className="text-lg font-bold tracking-tight">
              mp<span className="text-[#8c84ff]">ng</span>
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <a
              href="https://github.com/anointedthedeveloper/mpng"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <Link
              href="/editor"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#6C63FF] text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-[#6C63FF]/20"
            >
              Open Editor
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6C63FF]/8 rounded-full blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/25 bg-[#6C63FF]/8 text-[#a09cf7] text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
              AI-powered · Open source · Free
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-none mb-6">
              mp<span className="text-[#6C63FF]">ng</span>
            </h1>

            <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
              AI-powered media editing in the browser. Background removal, canvas tools, and video trimming — no installs required.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/editor"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#6C63FF] font-semibold text-sm hover:opacity-90 transition shadow-xl shadow-[#6C63FF]/25"
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
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 font-semibold text-sm text-white/70 hover:text-white hover:border-white/20 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub ↗
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-8 pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border bg-white/[0.02] p-6 transition-colors ${f.color}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.iconColor}`}>
                  {f.icon}
                </div>
                <h2 className="font-semibold text-white mt-4 text-sm">{f.title}</h2>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-8 py-5 flex items-center justify-between text-xs text-white/30">
          <span>mpng</span>
          <a
            href="https://github.com/anointedthedeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            @anointedthedeveloper
          </a>
        </footer>
      </main>
    </>
  )
}
