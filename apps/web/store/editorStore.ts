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
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'image',
  image: null,
  video: null,
  processedImage: null,
  filters: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sharpen: 0 },
  history: [],
  dimensions: null,
  activeTool: 'ai',

  setMode: (m) => set({ mode: m, image: null, video: null, processedImage: null, history: [], dimensions: null }),
  setImage: (src) => set({ image: src, processedImage: null, history: [], dimensions: null, mode: 'image' }),
  setVideo: (src) => set({ video: src, mode: 'video' }),
  setProcessedImage: (src) =>
    set((s) => ({ processedImage: src, history: [...s.history, s.processedImage ?? s.image ?? ''] })),
  setDimensions: (d) => set({ dimensions: d }),
  updateFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  setActiveTool: (t) => set({ activeTool: t }),
  undo: () => set((s) => {
    const history = [...s.history]
    const prev = history.pop()
    return { processedImage: prev ?? null, history }
  }),
  reset: () => set({
    image: null, video: null, processedImage: null, history: [],
    filters: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sharpen: 0 },
    dimensions: null, activeTool: 'ai',
  }),
}))
