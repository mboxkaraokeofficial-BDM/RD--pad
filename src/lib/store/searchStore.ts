import { create } from 'zustand'
import type { Song } from '../types'

interface SearchStore {
  query:     string
  category:  string
  results:   Song[]
  isLoading: boolean

  setQuery:     (v: string) => void
  setCategory:  (v: string) => void
  setResults:   (v: Song[]) => void
  setIsLoading: (v: boolean) => void
  clear:        () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query:     '',
  category:  'ทั้งหมด',
  results:   [],
  isLoading: false,

  setQuery:     (v) => set({ query: v }),
  setCategory:  (v) => set({ category: v }),
  setResults:   (v) => set({ results: v }),
  setIsLoading: (v) => set({ isLoading: v }),
  clear:        ()  => set({ query: '', results: [] }),
}))
