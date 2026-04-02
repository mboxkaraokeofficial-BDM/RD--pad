import { create } from 'zustand'
import type { Song } from '../types'
import { MOCK_SONGS } from '../mock-data'

interface PlayerStore {
  nowPlaying: Song | null
  isPlaying: boolean
  progress: number    // 0–100
  elapsed: number     // seconds
  key: number         // -5 to +5
  volumeMusic: number // 0–100
  volumeMic: number   // 0–100

  setNowPlaying:   (song: Song | null) => void
  setIsPlaying:    (v: boolean) => void
  setProgress:     (v: number) => void
  setElapsed:      (v: number) => void
  setKey:          (v: number) => void
  setVolumeMusic:  (v: number) => void
  setVolumeMic:    (v: number) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  nowPlaying:  MOCK_SONGS[0],   // pre-loaded for dev
  isPlaying:   false,
  progress:    35,
  elapsed:     86,
  key:         0,
  volumeMusic: 80,
  volumeMic:   65,

  setNowPlaying:  (song) => set({ nowPlaying: song }),
  setIsPlaying:   (v)    => set({ isPlaying: v }),
  setProgress:    (v)    => set({ progress: v }),
  setElapsed:     (v)    => set({ elapsed: v }),
  setKey:         (v)    => set({ key: Math.max(-5, Math.min(5, v)) }),
  setVolumeMusic: (v)    => set({ volumeMusic: Math.max(0, Math.min(100, v)) }),
  setVolumeMic:   (v)    => set({ volumeMic: Math.max(0, Math.min(100, v)) }),
}))
