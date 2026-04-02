'use client'
import { useState } from 'react'
import { Plus, QrCode, Settings2, SkipForward, Trash2 } from 'lucide-react'
import { MOCK_ROOMS } from '@/lib/mock-data'
import type { Room, RoomStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CFG: Record<RoomStatus, { label: string; color: string; dot: string }> = {
  connected:    { label: 'ออนไลน์',     color: 'text-status-online',  dot: 'bg-status-online' },
  connecting:   { label: 'กำลังเชื่อม', color: 'text-status-warning', dot: 'bg-status-warning animate-pulse' },
  disconnected: { label: 'ออฟไลน์',     color: 'text-status-offline', dot: 'bg-status-offline' },
  offline:      { label: 'ปิดอยู่',     color: 'text-status-idle',    dot: 'bg-status-idle'    },
}

export default function AdminPage() {
  const [rooms] = useState(MOCK_ROOMS)
  const online = rooms.filter(r => r.status === 'connected').length

  return (
    <div className="flex flex-col min-h-screen pb-8 animate-fade-in">

      {/* Header */}
      <div className="relative px-4 pt-8 pb-5">
        <div className="absolute top-0 inset-x-0 h-40 bg-glow-purple pointer-events-none" />
        <div className="relative">
          <h1 className="text-xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-xs text-text-secondary mt-1">
            {online}/{rooms.length} ห้อง · ออนไลน์
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex gap-2 mt-4">
          {[
            { label: 'ออนไลน์',     count: rooms.filter(r => r.status === 'connected').length,    color: 'text-status-online'  },
            { label: 'ออฟไลน์',     count: rooms.filter(r => r.status === 'disconnected').length, color: 'text-status-offline' },
            { label: 'ปิดอยู่',     count: rooms.filter(r => r.status === 'offline').length,      color: 'text-status-idle'    },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl px-3 py-2 text-center">
              <p className={cn('text-base font-bold', s.color)}>{s.count}</p>
              <p className="text-[10px] text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 flex gap-2 mb-4">
        <button className="btn-pill-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> เพิ่มห้อง
        </button>
        <button className="btn-pill-ghost flex items-center gap-1.5 text-sm">
          <QrCode size={16} /> QR Codes
        </button>
      </div>

      {/* Room list */}
      <div className="px-4 space-y-3">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
}

function RoomCard({ room }: { room: Room }) {
  const cfg = STATUS_CFG[room.status]
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Main row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-4 py-4 flex items-center gap-3"
      >
        {/* Status dot */}
        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />

        {/* Room info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-text-primary">{room.name}</p>
          {room.currentSong
            ? <p className="text-xs text-text-secondary truncate mt-0.5">▶ {room.currentSong.title}</p>
            : <p className={cn('text-xs mt-0.5', cfg.color)}>{cfg.label}</p>
          }
        </div>

        {/* IP */}
        <span className="text-xs text-text-muted font-mono shrink-0">{room.mboxIp}</span>
      </button>

      {/* Expanded controls */}
      {expanded && room.status === 'connected' && (
        <div className="px-4 pb-4 pt-1 border-t border-glass-border flex gap-2 animate-fade-in">
          <button className="btn-pill-ghost text-xs flex items-center gap-1.5 flex-1 justify-center">
            <SkipForward size={14} /> ข้ามเพลง
          </button>
          <button className="btn-pill-ghost text-xs flex items-center gap-1.5 flex-1 justify-center">
            <Trash2 size={14} /> ล้าง Queue
          </button>
          <button className="btn-pill-ghost text-xs flex items-center gap-1.5 flex-1 justify-center">
            <Settings2 size={14} /> ตั้งค่า
          </button>
        </div>
      )}
    </div>
  )
}
