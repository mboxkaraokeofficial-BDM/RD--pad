export interface Song {
  id: string
  title: string
  artist: string
  category: SongCategory
  duration: number // seconds
  language: 'TH' | 'EN' | 'JP' | 'KR' | 'CN'
  thumbnail?: string
  isNew?: boolean
}

export type SongCategory =
  | 'ลูกทุ่ง'
  | 'สตริง'
  | 'สากล'
  | 'เพลงใหม่'
  | 'ฮิต'
  | 'ลูกกรุง'
  | 'เพลงช้า'
  | 'ญี่ปุ่น'
  | 'เกาหลี'

export interface QueueItem {
  queueId: string // unique per queue slot
  song: Song
  addedAt: Date
  requestedBy?: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
}

export interface Room {
  id: string
  name: string
  mboxIp: string
  mboxPort: number
  status: RoomStatus
  currentSong?: Song
  sessionActive: boolean
}

export type RoomStatus = 'connected' | 'connecting' | 'disconnected' | 'offline'

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'offline'

export type AppMode = 'home' | 'shop'

export interface ConnectionConfig {
  mode: AppMode
  serverIp: string
  serverPort?: number
  roomId?: string
}

export interface PlayerState {
  nowPlaying: Song | null
  isPlaying: boolean
  progress: number   // 0–100
  elapsed: number    // seconds
  key: number        // -5 to +5
  volumeMusic: number // 0–100
  volumeMic: number   // 0–100
}

export interface Effect {
  id: string
  label: string
  emoji: string
  color: string
}

export interface User {
  id: string
  displayName: string
  avatar?: string
  provider: 'line' | 'google' | 'guest'
}
