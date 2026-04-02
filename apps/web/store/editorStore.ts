import { create } from 'zustand'

interface Filters {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sharpen: number
}

interface EditorState {
  mode: 'image' | 'video'
  image: string | null
  video: string | null
  processedImage: string | null
  filters: Filters
  history: string[]
  future: string[]
  dimensions: { w: number; h: number } | null
  activeTool: string
  setMode: (m: 'image' | 'video') => void
  setImage: (src: string) => void
  setVideo: (src: string) => void
  setProcessedImage: (src: string) => void
  setDimensions: (d: { w: number; h: number }) => void
  updateFilter: (key: keyof Filters, value: number) => void
  setActiveTool: (t: string) => void
  undo: () => void
  redo: () => void
  reset: () => void
}

const DEFAULT_FILTERS: Filters = { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sharpen: 0 }

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'image',
  image: null,
  video: null,
  processedImage: null,
  filters: { ...DEFAULT_FILTERS },
  history: [],
  future: [],
  dimensions: null,
  activeTool: 'ai',

  setMode: (m) => set({ mode: m, image: null, video: null, processedImage: null, history: [], future: [], dimensions: null }),
  setImage: (src) => set({ image: src, processedImage: null, history: [], future: [], dimensions: null, mode: 'image' }),
  setVideo: (src) => set({ video: src, mode: 'video' }),

  setProcessedImage: (src) =>
    set((s) => ({
      processedImage: src,
      history: [...s.history, s.processedImage ?? s.image ?? ''],
      future: [], // clear redo stack on new action
    })),

  setDimensions: (d) => set({ dimensions: d }),
  updateFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  setActiveTool: (t) => set({ activeTool: t }),

  undo: () => set((s) => {
    if (s.history.length === 0) return s
    const history = [...s.history]
    const prev = history.pop()!
    return {
      processedImage: prev || null,
      history,
      future: [s.processedImage ?? '', ...s.future],
    }
  }),

  redo: () => set((s) => {
    if (s.future.length === 0) return s
    const future = [...s.future]
    const next = future.shift()!
    return {
      processedImage: next || null,
      future,
      history: [...s.history, s.processedImage ?? ''],
    }
  }),

  reset: () => set({
    image: null, video: null, processedImage: null,
    history: [], future: [],
    filters: { ...DEFAULT_FILTERS },
    dimensions: null, activeTool: 'ai',
  }),
}))
