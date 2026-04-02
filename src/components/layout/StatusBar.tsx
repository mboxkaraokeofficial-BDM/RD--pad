'use client'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { useConnectionStore } from '@/lib/store/connectionStore'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  connected:    { color: 'text-status-online',  icon: Wifi,     label: null },
  connecting:   { color: 'text-status-warning', icon: Loader2,  label: 'กำลังเชื่อมต่อ...' },
  disconnected: { color: 'text-status-offline', icon: WifiOff,  label: 'ไม่ได้เชื่อมต่อ' },
  offline:      { color: 'text-status-idle',    icon: WifiOff,  label: 'ออฟไลน์' },
}

export default function StatusBar() {
  const { status, roomName } = useConnectionStore()
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div />
      <div className={cn('flex items-center gap-1.5 text-xs', cfg.color)}>
        <Icon
          size={12}
          className={cn(status === 'connecting' && 'animate-spin')}
        />
        <span>{cfg.label ?? roomName ?? ''}</span>
      </div>
    </div>
  )
}
