'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Play, Pause, SkipForward } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/playerStore'
import { controller } from '@/lib/triggers'
import { cn } from '@/lib/utils'

export default function FloatingPlayer() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { nowPlaying, isPlaying } = usePlayerStore()

  // Hide on now-playing page or if nothing loaded
  if (pathname === '/now-playing' || !nowPlaying) return null

  return (
    <div
      className={cn(
        'fixed top-0 inset-x-0 z-40 flex justify-center px-4',
        'pt-safe'
      )}
      style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 8px)' }}
    >
      <button
        onClick={() => router.push('/now-playing')}
        className="glass-nav rounded-2xl px-4 py-3 w-full max-w-sm flex items-center gap-3 shadow-card animate-slide-up"
      >
        {/* Album dot indicator */}
        <span className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse-glow shrink-0" />

        {/* Song info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-text-primary truncate leading-tight">
            {nowPlaying.title}
          </p>
          <p className="text-xs text-text-secondary truncate leading-tight mt-0.5">
            {nowPlaying.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); controller.togglePlay() }}
            className="icon-btn w-9 h-9 bg-accent-purple shadow-glow-sm text-white"
          >
            {isPlaying
              ? <Pause size={16} fill="white" />
              : <Play  size={16} fill="white" />
            }
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); controller.next() }}
            className="icon-btn w-9 h-9 text-text-secondary"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </button>
    </div>
  )
}
