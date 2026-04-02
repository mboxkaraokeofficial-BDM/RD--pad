'use client'
import { SkipBack, Play, Pause, SkipForward, Heart } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/playerStore'
import { controller } from '@/lib/triggers'
import { cn, formatDuration } from '@/lib/utils'
import StatusBar from '@/components/layout/StatusBar'

const KEY_STOPS = [-3, -2, -1, 0, 1, 2, 3]

export default function NowPlayingPage() {
  const {
    nowPlaying, isPlaying, progress, elapsed,
    key, volumeMusic, volumeMic,
    setKey, setVolumeMusic, setVolumeMic,
  } = usePlayerStore()

  const duration = nowPlaying?.duration ?? 0

  return (
    <div className="flex flex-col h-screen pb-28 overflow-hidden animate-fade-in">
      <StatusBar />

      {/* Album art area */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 gap-6">

        {/* Glow behind art */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-accent-purple opacity-20 blur-3xl" />
        </div>

        {/* Art */}
        <div className="relative w-56 h-56 rounded-3xl overflow-hidden shadow-glow-md border border-glass-border">
          <div className="w-full h-full bg-gradient-to-br from-accent-purple via-[#6D28D9] to-accent-pink flex items-center justify-center">
            <span className="text-7xl select-none">🎵</span>
          </div>
          {/* Favourite */}
          <button className="absolute top-3 right-3 icon-btn w-9 h-9 bg-black/40 text-white/70 hover:text-accent-pink">
            <Heart size={18} />
          </button>
        </div>

        {/* Song info */}
        <div className="text-center w-full">
          <h1 className="text-xl font-bold text-text-primary truncate">
            {nowPlaying?.title ?? '—'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">{nowPlaying?.artist ?? '—'}</p>
        </div>
      </div>

      {/* Controls area */}
      <div className="px-6 space-y-5 pb-2">

        {/* Progress bar */}
        <div className="space-y-1">
          <input
            type="range"
            min={0} max={100}
            value={progress}
            onChange={() => {}}
            className="w-full accent-accent-purple"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>{formatDuration(elapsed)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Playback buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => controller.prev()}
            className="icon-btn w-12 h-12 text-text-secondary active:text-white"
          >
            <SkipBack size={26} />
          </button>

          <button
            onClick={() => controller.togglePlay()}
            className={cn(
              'icon-btn w-16 h-16 text-white shadow-glow-md transition-all',
              'bg-gradient-to-br from-accent-purple to-accent-pink'
            )}
          >
            {isPlaying
              ? <Pause size={28} fill="white" />
              : <Play  size={28} fill="white" className="ml-1" />
            }
          </button>

          <button
            onClick={() => controller.next()}
            className="icon-btn w-12 h-12 text-text-secondary active:text-white"
          >
            <SkipForward size={26} />
          </button>
        </div>

        {/* KEY control */}
        <div className="glass-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Key</span>
            <span className={cn(
              'text-sm font-bold tabular-nums',
              key === 0 ? 'text-text-muted' : 'text-accent-purple'
            )}>
              {key > 0 ? `+${key}` : key}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {KEY_STOPS.map(k => (
              <button
                key={k}
                onClick={() => { setKey(k); controller.setKey(k) }}
                className={cn(
                  'flex-1 h-9 rounded-xl text-xs font-semibold transition-all active:scale-95',
                  key === k
                    ? 'bg-accent-purple text-white shadow-glow-sm'
                    : 'glass-card text-text-secondary'
                )}
              >
                {k > 0 ? `+${k}` : k}
              </button>
            ))}
          </div>
        </div>

        {/* Volume sliders */}
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <VolumeRow
            icon="🎵"
            label="เพลง"
            value={volumeMusic}
            color="#A855F7"
            onChange={(v) => { setVolumeMusic(v); controller.setVolumeMusic(v) }}
          />
          <VolumeRow
            icon="🎤"
            label="ไมค์"
            value={volumeMic}
            color="#EC4899"
            onChange={(v) => { setVolumeMic(v); controller.setVolumeMic(v) }}
          />
        </div>
      </div>
    </div>
  )
}

function VolumeRow({
  icon, label, value, color, onChange
}: {
  icon: string; label: string; value: number; color: string; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 shrink-0">{icon}</span>
      <span className="text-xs text-text-secondary w-8 shrink-0">{label}</span>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0} max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ accentColor: color }}
          className="w-full"
        />
      </div>
      <span className="text-xs font-semibold text-text-secondary w-7 text-right tabular-nums shrink-0">
        {value}
      </span>
    </div>
  )
}
