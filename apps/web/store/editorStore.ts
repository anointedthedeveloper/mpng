import { create } from 'zustand'

interface Filters {
  brightness: number
  contrast: number
  saturation: number
}

interface EditorState {
  image: string | null
  processedImage: string | null
  filters: Filters
  history: string[]
  dimensions: { w: number; h: number } | null
  setImage: (src: string) => void
  setProcessedImage: (src: string) => void
  setDimensions: (d: { w: number; h: number }) => void
  updateFilter: (key: keyof Filters, value: number) => void
  undo: () => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  image: null,
  processedImage: null,
  filters: { brightness: 100, contrast: 100, saturation: 100 },
  history: [],
  dimensions: null,

  setImage: (src) => set({ image: src, processedImage: null, history: [], dimensions: null }),

  setProcessedImage: (src) =>
    set((s) => ({ processedImage: src, history: [...s.history, s.processedImage ?? s.image ?? ''] })),

  setDimensions: (d) => set({ dimensions: d }),

  updateFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  undo: () =>
    set((s) => {
      const history = [...s.history]
      const prev = history.pop()
      return { processedImage: prev ?? null, history }
    }),

  reset: () => set({ image: null, processedImage: null, history: [], filters: { brightness: 100, contrast: 100, saturation: 100 }, dimensions: null }),
}))
