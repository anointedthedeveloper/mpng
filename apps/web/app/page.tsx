import Link from 'next/link'
import { 
  Eraser, 
  Crop, 
  Video, 
  ArrowRight, 
  Github, 
  Zap, 
  Shield, 
  Monitor, 
  Sparkles,
  Layers,
  Layout,
  MousePointer2
} from 'lucide-react'

const features = [
  {
    title: 'Background Removal',
    desc: 'One-click AI cutouts powered by modern processing.',
    accent: 'from-cyan-400/30 to-indigo-500/20',
    icon: Eraser,
    color: 'text-cyan-400'
  },
  {
    title: 'Canvas Editing',
    desc: 'Crop, resize, and tune visuals inside a focused editor.',
    accent: 'from-fuchsia-400/25 to-rose-500/15',
    icon: Crop,
    color: 'text-fuchsia-400'
  },
  {
    title: 'Video Trimming',
    desc: 'Export cleaner clips with a lightweight workflow.',
    accent: 'from-amber-300/25 to-orange-500/15',
    icon: Video,
    color: 'text-amber-400'
  },
]

const stats = [
  { value: '3', label: 'Core Tools', icon: Zap },
  { value: '1', label: 'Workspace', icon: Layout },
  { value: '0', label: 'Installs', icon: Shield },
]

export default function Home() {
  return (
    <main className="mpng-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0C1B]/80 backdrop-blur-3xl shadow-2xl shadow-black/60">
        
        {/* Navigation */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
          <Link href="/" className="group flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6C63FF] text-sm font-bold text-white shadow-lg shadow-[#6C63FF]/30 transition-transform group-hover:scale-110">
              mp
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                mp<span className="text-[#8c84ff]">ng</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Studio v1.0</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/anointedthedeveloper/mpng"
              target="_blank"
              rel="noopener noreferrer"
              className="mpng-btn-secondary hidden items-center gap-2 px-5 sm:inline-flex"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <Link href="/editor" className="mpng-btn-primary group gap-2 px-6">
              <span>Open Editor</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="grid flex-1 items-center gap-16 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/5 px-5 py-2.5 text-xs font-medium text-[#8c84ff]">
              <Sparkles className="h-4 w-4 fill-[#8c84ff]/20" />
              AI-powered media editing in your browser
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Professional editing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#A8A3FF]">reimagined</span> for speed.
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/60">
              mpng combines AI background removal, precise canvas tools, and video trimming into a 
              singular, fluid workspace designed for creators who value their time.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/editor" className="mpng-btn-primary group h-14 gap-3 px-8 text-base">
                Get started for free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://github.com/anointedthedeveloper/mpng"
                target="_blank"
                rel="noopener noreferrer"
                className="mpng-btn-secondary h-14 gap-3 px-8 text-base"
              >
                <Github className="h-5 w-5" />
                Documentation
              </a>
            </div>

            {/* Stats */}
            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 hover:bg-white/[0.05]">
                  <stat.icon className="h-5 w-5 text-white/40 group-hover:text-[#8c84ff] transition-colors" />
                  <dt className="mt-4 text-3xl font-bold text-white">{stat.value}</dt>
                  <dd className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual Elements */}
          <div className="relative grid gap-5">
            <div className="mpng-card relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent p-10 ring-1 ring-white/10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6C63FF]/10 blur-[100px]" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 h-1.5 w-32 rounded-full bg-white/10" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {features.map((feature) => (
                    <article
                      key={feature.title}
                      className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${feature.accent} p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color} mb-4`} />
                      <h2 className="text-lg font-bold text-white">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{feature.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="mpng-card flex flex-col gap-4 p-8 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Monitor className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Universal Accessibility</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  No heavy installations. Your browser is your studio. Edit from any device, anywhere.
                </p>
              </div>
              
              <div className="mpng-card flex flex-col gap-4 p-8 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#8c84ff]">
                  <MousePointer2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Focus on Workflow</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Minimalist UI that prioritizes your content, with zero clutter to distract you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="mt-auto border-t border-white/5 bg-black/20 px-10 py-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Layers className="h-4 w-4" />
              Built for modern creators
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-white/40 transition hover:text-[#8c84ff]">Privacy</a>
              <a href="#" className="text-sm text-white/40 transition hover:text-[#8c84ff]">Terms</a>
              <a href="https://github.com/anointedthedeveloper" className="text-sm text-white/40 transition hover:text-[#8c84ff]">@anointedthedeveloper</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
