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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          mp<span className="text-brand">ng</span>
        </h1>
        <p className="mt-3 text-gray-400 text-lg">AI-powered media editing in the browser</p>
      </div>

      <div className="flex gap-4 mt-4">
        <Link
          href="/editor"
          className="px-6 py-3 bg-brand rounded-lg font-semibold hover:opacity-90 transition"
        >
          Open Editor
        </Link>
        <a
          href="https://github.com/anointedthedeveloper/mpng"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-gray-700 rounded-lg font-semibold hover:border-gray-500 transition"
        >
          GitHub
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl w-full">
        {[
          { title: 'Background Removal', desc: 'AI-powered, one click' },
          { title: 'Canvas Editing', desc: 'Filters, crop, resize' },
          { title: 'Video Trimming', desc: 'FFmpeg-powered export' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-gray-600 text-sm">
        Built by{' '}
        <a
          href="https://github.com/anointedthedeveloper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          anointedthedeveloper
        </a>
      </footer>
      </main>
    </>
  )
}
