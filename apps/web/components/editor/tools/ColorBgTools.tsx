'use client'
import { useState, useMemo } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { addColorBackground } from '@/lib/api'

// Solid color swatches
const SOLIDS = [
  '#ffffff', '#000000', '#111111', '#1a1a2e',
  '#6C63FF', '#8b5cf6', '#a855f7', '#ec4899',
  '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

// Gradient presets: [label, from, to, direction]
const GRADIENTS = [
  { label: 'Violet Dream',  from: '#6C63FF', to: '#ec4899', dir: '135deg' },
  { label: 'Ocean',         from: '#06b6d4', to: '#3b82f6', dir: '135deg' },
  { label: 'Sunset',        from: '#f97316', to: '#ec4899', dir: '135deg' },
  { label: 'Forest',        from: '#22c55e', to: '#14b8a6', dir: '135deg' },
  { label: 'Gold',          from: '#eab308', to: '#f97316', dir: '135deg' },
  { label: 'Midnight',      from: '#1a1a2e', to: '#6C63FF', dir: '160deg' },
  { label: 'Rose',          from: '#ec4899', to: '#ef4444', dir: '135deg' },
  { label: 'Aurora',        from: '#06b6d4', to: '#8b5cf6', dir: '135deg' },
  { label: 'Peach',         from: '#f97316', to: '#eab308', dir: '120deg' },
  { label: 'Neon',          from: '#22c55e', to: '#06b6d4', dir: '135deg' },
  { label: 'Candy',         from: '#ec4899', to: '#a855f7', dir: '135deg' },
  { label: 'Deep Space',    from: '#0f0c29', to: '#302b63', dir: '135deg' },
  { label: 'Lavender',      from: '#a855f7', to: '#6C63FF', dir: '135deg' },
  { label: 'Emerald',       from: '#059669', to: '#0d9488', dir: '135deg' },
  { label: 'Fire',          from: '#ef4444', to: '#f97316', dir: '135deg' },
  { label: 'Ice',           from: '#bae6fd', to: '#e0f2fe', dir: '135deg' },
  { label: 'Dusk',          from: '#312e81', to: '#be185d', dir: '160deg' },
  { label: 'Mint',          from: '#6ee7b7', to: '#3b82f6', dir: '135deg' },
  { label: 'Coral',         from: '#fb7185', to: '#f97316', dir: '135deg' },
  { label: 'Galaxy',        from: '#1e1b4b', to: '#4c1d95', dir: '135deg' },
]

const DIRECTIONS = [
  { label: '→',  val: '90deg' },
  { label: '↘',  val: '135deg' },
  { label: '↓',  val: '180deg' },
  { label: '↙',  val: '225deg' },
  { label: '←',  val: '270deg' },
]

type Tab = 'solid' | 'gradient' | 'custom'

export default function ColorBgTools() {
  const { image, setProcessedImage } = useEditorStore()
  const [tab, setTab] = useState<Tab>('gradient')
  const [selectedSolid, setSelectedSolid] = useState('#6C63FF')
  const [selectedGrad, setSelectedGrad] = useState(GRADIENTS[0])
  const [customFrom, setCustomFrom] = useState('#6C63FF')
  const [customTo, setCustomTo] = useState('#ec4899')
  const [customDir, setCustomDir] = useState('135deg')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const preview = useMemo(() => {
    if (tab === 'solid') return selectedSolid
    if (tab === 'gradient') return `linear-gradient(${selectedGrad.dir}, ${selectedGrad.from}, ${selectedGrad.to})`
    return `linear-gradient(${customDir}, ${customFrom}, ${customTo})`
  }, [tab, selectedSolid, selectedGrad, customFrom, customTo, customDir])

  const apply = async () => {
    if (!image) return
    setLoading(true); setError(null)
    try {
      let url: string
      if (tab === 'solid') {
        url = await addColorBackground(image, selectedSolid)
      } else if (tab === 'gradient') {
        url = await addColorBackground(image, selectedGrad.from, selectedGrad.to, selectedGrad.dir)
      } else {
        url = await addColorBackground(image, customFrom, customTo, customDir)
      }
      setProcessedImage(url)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Background</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['solid', 'gradient', 'custom'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition ${tab === t ? 'bg-[#6C63FF] text-white' : 'text-white/40 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Solid tab */}
      {tab === 'solid' && (
        <div className="grid grid-cols-8 gap-1.5">
          {SOLIDS.map(c => (
            <button key={c} onClick={() => setSelectedSolid(c)}
              className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${selectedSolid === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ background: c }} />
          ))}
        </div>
      )}

      {/* Gradient tab */}
      {tab === 'gradient' && (
        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
          {GRADIENTS.map(g => (
            <button key={g.label} onClick={() => setSelectedGrad(g)}
              className={`h-12 rounded-xl border-2 transition-transform hover:scale-[1.03] flex items-end p-1.5 ${selectedGrad.label === g.label ? 'border-white' : 'border-transparent'}`}
              style={{ background: `linear-gradient(${g.dir}, ${g.from}, ${g.to})` }}>
              <span className="text-[9px] font-bold text-white/80 bg-black/30 px-1.5 py-0.5 rounded-md backdrop-blur-sm">{g.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Custom tab */}
      {tab === 'custom' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {[['From', customFrom, setCustomFrom], ['To', customTo, setCustomTo]].map(([label, val, set]) => (
              <label key={label as string} className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-white/30">{label as string}</span>
                <div className="relative h-9 rounded-lg overflow-hidden border border-white/10">
                  <input type="color" value={val as string} onChange={e => (set as any)(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                  <div className="absolute inset-0" style={{ background: val as string }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white mix-blend-difference">{val as string}</span>
                </div>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/30">Direction</span>
            <div className="flex gap-1">
              {DIRECTIONS.map(d => (
                <button key={d.val} onClick={() => setCustomDir(d.val)}
                  className={`flex-1 h-8 rounded-lg text-sm font-bold transition ${customDir === d.val ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="h-14 rounded-xl border border-white/10 transition-all duration-300" style={{ background: preview }} />

      <button onClick={apply} disabled={loading || !image}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {loading ? <><Spinner />Applying…</> : <>Apply Background</>}
      </button>

      {error && <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
