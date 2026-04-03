'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Play, Pause, SkipForward } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/playerStore'
import { useQueueStore } from '@/lib/store/queueStore'
import { controller } from '@/lib/triggers'
import { cn } from '@/lib/utils'

export default function FloatingPlayer() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { nowPlaying, isPlaying, progress } = usePlayerStore()
  const { queue } = useQueueStore()

  // Hide on now-playing page or setup/rooms pages
  const hideOn = ['/now-playing', '/setup', '/rooms']
  if (hideOn.includes(pathname) || !nowPlaying) return null

  return (
    // Sits just above bottom nav — nav height ~80px
    <div className="fixed bottom-[80px] inset-x-0 z-40 flex justify-center px-3">
      <button
        onClick={() => router.push('/now-playing')}
        className={cn(
          'w-full max-w-sm overflow-hidden rounded-2xl',
          'glass-nav shadow-card animate-slide-up',
          'flex flex-col'
        )}
      >
        {/* Progress bar — thin line at top (Spotify style) */}
        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-accent-teal transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content row */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Album art thumbnail */}
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
            <div className="w-full h-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <span className="text-lg">🎵</span>
            </div>
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-text-primary truncate leading-tight">
              {nowPlaying.title}
            </p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              {nowPlaying.artist}
            </p>
          </div>

          {/* Controls — Spotify style */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); controller.togglePlay() }}
              className="icon-btn w-10 h-10 text-white"
            >
              {isPlaying
                ? <Pause size={22} fill="white" />
                : <Play  size={22} fill="white" className="ml-0.5" />
              }
            </button>
            <button
              onClick={e => { e.stopPropagation(); controller.next() }}
              className="icon-btn w-10 h-10 text-text-secondary"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </button>
    </div>
  )
}
