import type { Song, ConnectionConfig } from '../types'

/**
 * KaraokeController — abstract interface for all UI triggers.
 * Swap mock ↔ websocket ↔ any future protocol without touching UI.
 */
export interface KaraokeController {
  // ── Playback ──────────────────────────────────────────────
  play(): void
  pause(): void
  togglePlay(): void
  next(): void
  prev(): void

  // ── Audio controls ────────────────────────────────────────
  setKey(value: number): void          // -5 to +5
  setVolumeMusic(value: number): void  // 0–100
  setVolumeMic(value: number): void    // 0–100

  // ── Queue ─────────────────────────────────────────────────
  addToQueue(song: Song): Promise<void>
  removeFromQueue(queueId: string): void
  reorderQueue(fromIndex: number, toIndex: number): void
  clearQueue(): void

  // ── Song search ───────────────────────────────────────────
  searchSongs(query: string, category?: string): Promise<Song[]>

  // ── Effect soundboard ─────────────────────────────────────
  playEffect(effectId: string): void
  setVolumeEffect(value: number): void

  // ── Connection ────────────────────────────────────────────
  connect(config: ConnectionConfig): Promise<void>
  disconnect(): void
}
