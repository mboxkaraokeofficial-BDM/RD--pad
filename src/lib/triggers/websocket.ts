/**
 * WebSocketController — production implementation.
 * Connects browser → Node.js backend (Socket.io) → TCP:6666 → MBOX.
 *
 * TODO: implement when backend is ready.
 */
import type { KaraokeController } from './types'
import type { Song, ConnectionConfig } from '../types'

export const WebSocketController: KaraokeController = {
  play()           { /* TODO: socket.emit('CMD', { action: 'PLAY' }) */ },
  pause()          { /* TODO: socket.emit('CMD', { action: 'PAUSE' }) */ },
  togglePlay()     { /* TODO */ },
  next()           { /* TODO: socket.emit('CMD', { action: 'NEXT' }) */ },
  prev()           { /* TODO: socket.emit('CMD', { action: 'PREV' }) */ },
  setKey(v)        { /* TODO: socket.emit('CMD', { action: 'KEY', value: v }) */ },
  setVolumeMusic(v){ /* TODO: socket.emit('CMD', { action: 'VOL_MUSIC', value: v }) */ },
  setVolumeMic(v)  { /* TODO: socket.emit('CMD', { action: 'VOL_MIC', value: v }) */ },

  async addToQueue(song: Song) {
    /* TODO: socket.emit('CMD', { action: 'ADD', song_id: song.id }) */
  },
  removeFromQueue(queueId: string) {
    /* TODO: socket.emit('CMD', { action: 'REMOVE', queue_id: queueId }) */
  },
  reorderQueue(from: number, to: number) {
    /* TODO: socket.emit('CMD', { action: 'REORDER', from, to }) */
  },
  clearQueue() {
    /* TODO: socket.emit('CMD', { action: 'CLEAR_QUEUE' }) */
  },

  async searchSongs(query: string, category?: string) {
    /* TODO: const res = await fetch(`/api/songs/search?q=${query}&cat=${category}`) */
    return []
  },

  playEffect(effectId: string)  { /* TODO: socket.emit('CMD', { action: 'EFFECT', id: effectId }) */ },
  setVolumeEffect(value: number){ /* TODO: socket.emit('CMD', { action: 'VOL_EFFECT', value }) */ },

  async connect(config: ConnectionConfig) {
    /* TODO: init socket.io, join room namespace */
  },
  disconnect() {
    /* TODO: socket.disconnect() */
  },
}
