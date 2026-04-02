import { create } from 'zustand'
import type { QueueItem, Song } from '../types'
import { MOCK_SONGS } from '../mock-data'

interface QueueStore {
  queue: QueueItem[]
  addToQueue:    (song: Song) => void
  removeFromQueue:(queueId: string) => void
  reorderQueue:  (from: number, to: number) => void
  clearQueue:    () => void
}

const seedQueue: QueueItem[] = [
  { queueId: 'q1', song: MOCK_SONGS[4],  addedAt: new Date() },
  { queueId: 'q2', song: MOCK_SONGS[14], addedAt: new Date() },
  { queueId: 'q3', song: MOCK_SONGS[7],  addedAt: new Date() },
]

export const useQueueStore = create<QueueStore>((set) => ({
  queue: seedQueue,

  addToQueue(song) {
    const item: QueueItem = {
      queueId: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      song,
      addedAt: new Date(),
    }
    set(s => ({ queue: [...s.queue, item] }))
  },

  removeFromQueue(queueId) {
    set(s => ({ queue: s.queue.filter(i => i.queueId !== queueId) }))
  },

  reorderQueue(from, to) {
    set(s => {
      const q = [...s.queue]
      const [item] = q.splice(from, 1)
      q.splice(to, 0, item)
      return { queue: q }
    })
  },

  clearQueue() {
    set({ queue: [] })
  },
}))
