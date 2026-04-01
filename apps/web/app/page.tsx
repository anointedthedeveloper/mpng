import Link from 'next/link'

const features = [
  {
    title: 'Background Removal',
    desc: 'One-click cutouts powered by your existing API flow.',
    accent: 'from-cyan-400/30 to-indigo-500/20',
  },
  {
    title: 'Canvas Editing',
    desc: 'Crop, resize, and tune visuals inside a focused editor.',
    accent: 'from-fuchsia-400/25 to-rose-500/15',
  },
  {
    title: 'Video Trimming',
    desc: 'Export cleaner clips with a lightweight editing workflow.',
    accent: 'from-amber-300/25 to-orange-500/15',
  },
]

const stats = [
  { value: '3', label: 'core tools' },
  { value: '1', label: 'browser workflow' },
  { value: '0', label: 'desktop installs' },
]

export default function Home() {
  return (
    <main className="mpng-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF] text-sm font-bold text-white shadow-lg shadow-[#6C63FF]/30">
              mp
            </span>
            <span className="text-lg font-semibold tracking-tight">
              mp<span className="text-[#8c84ff]">ng</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/anointedthedeveloper/mpng"
              target="_blank"
              rel="noopener noreferrer"
              className="mpng-btn-secondary hidden sm:inline-flex"
            >
              View GitHub
            </a>
            <Link href="/editor" className="mpng-btn-primary">
              Open Editor
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
              AI-powered media editing in the browser
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Edit images and clips without leaving the browser.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              mpng combines background removal, canvas editing, and video trimming into one
              focused workspace built for fast, clean creation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/editor" className="mpng-btn-primary">
                Start editing
              </Link>
              <a
                href="https://github.com/anointedthedeveloper/mpng"
                target="_blank"
                rel="noopener noreferrer"
                className="mpng-btn-secondary"
              >
                Open source
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-2xl font-semibold text-white">{stat.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4">
            <div className="mpng-card relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,99,255,0.25),transparent_30%)]" />
              <div className="relative">
                <p className="mpng-label">Workspace preview</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <article
                      key={feature.title}
                      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${feature.accent} p-5`}
                    >
                      <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-white/70">{feature.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="mpng-card">
                <p className="mpng-label">Fast workflow</p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Upload, edit, and export with a lightweight interface that keeps attention on
                  the media itself.
                </p>
              </div>
              <div className="mpng-card">
                <p className="mpng-label">Built for clarity</p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Strong contrast, deliberate spacing, and restrained accents help every page
                  feel polished and usable.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
