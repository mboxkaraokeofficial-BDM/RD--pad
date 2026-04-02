'use client'
import { useRouter } from 'next/navigation'
import { MOCK_ROOMS } from '@/lib/mock-data'
import { useConnectionStore } from '@/lib/store/connectionStore'
import type { Room, RoomStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CFG: Record<RoomStatus, { label: string; color: string; dot: string; disabled: boolean }> = {
  connected:    { label: 'ออนไลน์',  color: 'text-status-online',  dot: 'bg-status-online',  disabled: false },
  connecting:   { label: 'กำลังเชื่อม', color: 'text-status-warning', dot: 'bg-status-warning animate-pulse', disabled: true  },
  disconnected: { label: 'ว่าง',     color: 'text-text-muted',     dot: 'bg-status-idle',    disabled: false },
  offline:      { label: 'ออฟไลน์',  color: 'text-status-offline', dot: 'bg-status-offline', disabled: true  },
}

export default function RoomsPage() {
  const router = useRouter()
  const { setRoomId, setRoomName } = useConnectionStore()

  function selectRoom(room: Room) {
    if (STATUS_CFG[room.status].disabled) return
    setRoomId(room.id)
    setRoomName(room.name)
    router.push('/now-playing')
  }

  return (
    <div className="flex flex-col min-h-screen px-4 animate-fade-in">
      {/* Header */}
      <div className="relative pt-10 pb-6">
        <div className="absolute top-0 inset-x-0 h-48 bg-glow-purple pointer-events-none" />
        <div className="relative text-center">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-xl font-bold text-text-primary">เลือกห้อง</h1>
          <p className="text-text-secondary text-sm mt-1">{MOCK_ROOMS.length} ห้องในระบบ</p>
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-3">
        {MOCK_ROOMS.map(room => {
          const cfg = STATUS_CFG[room.status]
          return (
            <button
              key={room.id}
              onClick={() => selectRoom(room)}
              disabled={cfg.disabled}
              className={cn(
                'glass-card rounded-2xl px-4 py-4 w-full flex items-center gap-4 transition-all',
                !cfg.disabled && 'active:scale-[0.98]',
                cfg.disabled  && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className={cn('w-3 h-3 rounded-full shrink-0', cfg.dot)} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-text-primary">{room.name}</p>
                {room.currentSong
                  ? <p className="text-xs text-text-secondary truncate mt-0.5">▶ {room.currentSong.title}</p>
                  : <p className={cn('text-xs mt-0.5', cfg.color)}>{cfg.label}</p>
                }
              </div>
              <span className="text-xs font-mono text-text-muted shrink-0">{room.mboxIp}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
