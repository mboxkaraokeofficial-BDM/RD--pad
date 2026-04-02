'use client'
import { useState } from 'react'
import { GripVertical, Trash2, ListMusic, X } from 'lucide-react'
import { useQueueStore } from '@/lib/store/queueStore'
import { usePlayerStore } from '@/lib/store/playerStore'
import { controller } from '@/lib/triggers'
import { formatDuration } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { QueueItem } from '@/lib/types'

export default function QueuePage() {
  const { queue, removeFromQueue, reorderQueue, clearQueue } = useQueueStore()
  const { nowPlaying } = usePlayerStore()
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  function handleDragStart(queueId: string) {
    setDragging(queueId)
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDragOver(idx)
  }
  function handleDrop(toIndex: number) {
    if (!dragging) return
    const fromIndex = queue.findIndex(i => i.queueId === dragging)
    if (fromIndex !== -1 && fromIndex !== toIndex) {
      reorderQueue(fromIndex, toIndex)
      controller.reorderQueue(fromIndex, toIndex)
    }
    setDragging(null)
    setDragOver(null)
  }
  function handleRemove(queueId: string) {
    removeFromQueue(queueId)
    controller.removeFromQueue(queueId)
  }

  return (
    <div className="flex flex-col h-screen pb-28 animate-fade-in">

      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">คิวเพลง</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {queue.length} เพลงรออยู่
          </p>
        </div>
        {queue.length > 0 && (
          <button
            onClick={() => { clearQueue(); controller.clearQueue() }}
            className="btn-pill-ghost text-status-offline text-xs flex items-center gap-1.5"
          >
            <X size={14} />
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Now playing */}
      {nowPlaying && (
        <div className="px-4 pb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">กำลังเล่น</p>
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 border-l-2 border-accent-purple">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse-glow shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{nowPlaying.title}</p>
              <p className="text-xs text-text-secondary">{nowPlaying.artist}</p>
            </div>
            <span className="text-xs text-text-muted">{formatDuration(nowPlaying.duration)}</span>
          </div>
        </div>
      )}

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto px-4">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-10">
            <ListMusic size={48} className="text-text-muted" />
            <p className="text-text-secondary text-sm">ยังไม่มีเพลงในคิว</p>
            <a href="/search" className="btn-pill-primary text-sm">+ เพิ่มเพลง</a>
          </div>
        ) : (
          <div className="space-y-2 py-1">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">ถัดไป</p>
            {queue.map((item, idx) => (
              <QueueRow
                key={item.queueId}
                item={item}
                index={idx + 1}
                isDragging={dragging === item.queueId}
                isDragOver={dragOver === idx}
                onDragStart={() => handleDragStart(item.queueId)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={() => { setDragging(null); setDragOver(null) }}
                onRemove={() => handleRemove(item.queueId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function QueueRow({
  item, index, isDragging, isDragOver,
  onDragStart, onDragOver, onDrop, onDragEnd, onRemove
}: {
  item: QueueItem; index: number; isDragging: boolean; isDragOver: boolean
  onDragStart(): void; onDragOver(e: React.DragEvent): void
  onDrop(): void; onDragEnd(): void; onRemove(): void
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'glass-card rounded-2xl px-3 py-3 flex items-center gap-3 transition-all',
        isDragging  && 'opacity-40 scale-95',
        isDragOver  && 'border-accent-purple/50 bg-accent-purple/10'
      )}
    >
      {/* Drag handle */}
      <button className="icon-btn w-7 h-7 text-text-muted cursor-grab active:cursor-grabbing shrink-0">
        <GripVertical size={18} />
      </button>

      {/* Index */}
      <span className="text-xs font-bold text-text-muted w-4 shrink-0">{index}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{item.song.title}</p>
        <p className="text-xs text-text-secondary">{item.song.artist} · {formatDuration(item.song.duration)}</p>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="icon-btn w-8 h-8 text-text-muted hover:text-status-offline transition-colors shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
