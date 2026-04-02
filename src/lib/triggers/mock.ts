/**
 * MockController — full UI-runnable implementation using Zustand stores.
 * No real network calls. Replace with WebSocketController for production.
 */
import type { KaraokeController } from './types'
import type { Song, ConnectionConfig } from '../types'
import { MOCK_SONGS } from '../mock-data'

function getStores() {
  // Lazy import to avoid circular deps at module init
  const { usePlayerStore } = require('../store/playerStore')
  const { useQueueStore }  = require('../store/queueStore')
  const { useConnectionStore } = require('../store/connectionStore')
  return {
    player:     usePlayerStore.getState(),
    queue:      useQueueStore.getState(),
    connection: useConnectionStore.getState(),
  }
}

export const MockController: KaraokeController = {
  play() {
    getStores().player.setIsPlaying(true)
    console.log('[Mock] PLAY')
  },
  pause() {
    getStores().player.setIsPlaying(false)
    console.log('[Mock] PAUSE')
  },
  togglePlay() {
    const { isPlaying } = getStores().player
    isPlaying ? this.pause() : this.play()
  },
  next() {
    const { queue, removeFromQueue } = getStores().queue
    const { setNowPlaying, setProgress, setIsPlaying } = getStores().player
    if (queue.length > 0) {
      const next = queue[0]
      setNowPlaying(next.song)
      removeFromQueue(next.queueId)
      setProgress(0)
      setIsPlaying(true)
      console.log('[Mock] NEXT →', next.song.title)
    }
  },
  prev() {
    console.log('[Mock] PREV')
    getStores().player.setProgress(0)
  },

  setKey(value) {
    getStores().player.setKey(value)
    console.log('[Mock] KEY', value)
  },
  setVolumeMusic(value) {
    getStores().player.setVolumeMusic(value)
    console.log('[Mock] VOL_MUSIC', value)
  },
  setVolumeMic(value) {
    getStores().player.setVolumeMic(value)
    console.log('[Mock] VOL_MIC', value)
  },

  async addToQueue(song) {
    getStores().queue.addToQueue(song)
    console.log('[Mock] ADD_QUEUE', song.title)

    // If nothing playing, start immediately
    const { nowPlaying, setNowPlaying, setIsPlaying } = getStores().player
    if (!nowPlaying) {
      setNowPlaying(song)
      setIsPlaying(true)
      getStores().queue.removeFromQueue(
        getStores().queue.queue[0]?.queueId ?? ''
      )
    }
  },
  removeFromQueue(queueId) {
    getStores().queue.removeFromQueue(queueId)
    console.log('[Mock] REMOVE_QUEUE', queueId)
  },
  reorderQueue(from, to) {
    getStores().queue.reorderQueue(from, to)
    console.log('[Mock] REORDER', from, '→', to)
  },
  clearQueue() {
    getStores().queue.clearQueue()
    console.log('[Mock] CLEAR_QUEUE')
  },

  async searchSongs(query, category) {
    await new Promise(r => setTimeout(r, 300)) // simulate latency
    const q = query.toLowerCase()
    return MOCK_SONGS.filter(s => {
      const matchQuery = !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      const matchCat   = !category || category === 'ทั้งหมด' || s.category === category
      return matchQuery && matchCat
    })
  },

  playEffect(effectId) {
    console.log('[Mock] EFFECT', effectId)
    // In real impl: send WebSocket event → backend → TCP → MBOX
  },
  setVolumeEffect(value) {
    console.log('[Mock] VOL_EFFECT', value)
  },

  async connect(config: ConnectionConfig) {
    const { setStatus, setMode, setRoomId, setServerIp } = getStores().connection
    setStatus('connecting')
    setMode(config.mode)
    setServerIp(config.serverIp)
    if (config.roomId) setRoomId(config.roomId)
    await new Promise(r => setTimeout(r, 1200))
    setStatus('connected')
    console.log('[Mock] CONNECTED', config)
  },
  disconnect() {
    getStores().connection.setStatus('disconnected')
    console.log('[Mock] DISCONNECTED')
  },
}
