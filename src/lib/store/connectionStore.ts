import { create } from 'zustand'
import type { ConnectionStatus, AppMode } from '../types'

interface ConnectionStore {
  status:     ConnectionStatus
  mode:       AppMode
  serverIp:   string | null
  roomId:     string | null
  roomName:   string | null

  setStatus:   (v: ConnectionStatus) => void
  setMode:     (v: AppMode) => void
  setServerIp: (v: string) => void
  setRoomId:   (v: string) => void
  setRoomName: (v: string) => void
  reset:       () => void
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  status:   'connected',   // pre-connected for dev/mock
  mode:     'shop',
  serverIp: '192.168.1.1',
  roomId:   'room-1',
  roomName: 'ห้อง 1',

  setStatus:   (v) => set({ status: v }),
  setMode:     (v) => set({ mode: v }),
  setServerIp: (v) => set({ serverIp: v }),
  setRoomId:   (v) => set({ roomId: v }),
  setRoomName: (v) => set({ roomName: v }),
  reset:       ()  => set({ status: 'disconnected', roomId: null, roomName: null }),
}))
