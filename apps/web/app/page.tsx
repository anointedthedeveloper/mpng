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
    icon: '✂️',
    title: 'Background Removal',
    desc: 'AI-powered, one click',
  },
  {
    icon: '🎨',
    title: 'Canvas Editing',
    desc: 'Filters, crop, resize',
  },
  {
    icon: '🎬',
    title: 'Video Trimming',
    desc: 'FFmpeg-powered export',
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-950 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C63FF]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5">
          <span className="text-xl font-bold tracking-tight">
            mp<span className="text-[#6C63FF]">ng</span>
          </span>
          <a
            href="https://github.com/anointedthedeveloper/mpng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-white transition flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </nav>

        {/* Hero */}
        <div className="text-center z-10 mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-[#a09cf7] text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
            AI-powered · Open source
          </div>

          <h1 className="text-7xl font-bold tracking-tight leading-none">
            mp<span className="text-[#6C63FF]">ng</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            AI-powered media editing in the browser. Background removal, filters, and video trimming — no installs.
          </p>

          <div className="flex gap-3 mt-8 justify-center">
            <Link
              href="/editor"
              className="px-6 py-3 bg-[#6C63FF] rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-[#6C63FF]/20"
            >
              Open Editor
            </Link>
            <a
              href="https://github.com/anointedthedeveloper/mpng"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-800 rounded-xl font-semibold text-sm hover:border-gray-600 text-gray-300 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl w-full z-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold text-white mt-3 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-gray-700 text-xs z-10">
          Built by{' '}
          <a
            href="https://github.com/anointedthedeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition"
          >
            anointedthedeveloper
          </a>
        </footer>
      </main>
    </>
  )
}
