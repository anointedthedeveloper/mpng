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
  { icon: '✂️', title: 'Background Removal', desc: 'One-click AI cutouts via rembg', color: 'border-cyan-500/20 hover:border-cyan-500/40' },
  { icon: '🎨', title: 'Canvas Editing', desc: 'Filters, crop, resize with Konva.js', color: 'border-fuchsia-500/20 hover:border-fuchsia-500/40' },
  { icon: '🎬', title: 'Video Trimming', desc: 'FFmpeg-powered clip export', color: 'border-amber-500/20 hover:border-amber-500/40' },
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
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-8 pb-20">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border bg-white/[0.02] p-6 transition-colors ${f.color}`}
              >
                <span className="text-2xl">{f.icon}</span>
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
