'use client'
import { useEffect, useRef, useState } from 'react'
import { Search, X, Plus, Check, Loader2 } from 'lucide-react'
import { useSearchStore } from '@/lib/store/searchStore'
import { useQueueStore } from '@/lib/store/queueStore'
import { controller } from '@/lib/triggers'
import { SONG_CATEGORIES, formatDuration } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Song } from '@/lib/types'

export default function SearchPage() {
  const { query, category, results, isLoading,
    setQuery, setCategory, setResults, setIsLoading } = useSearchStore()
  const { queue } = useQueueStore()
  const [added, setAdded] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query && category === 'ทั้งหมด') {
      setResults([]); setIsLoading(false); return
    }
    setIsLoading(true)
    timerRef.current = setTimeout(async () => {
      const res = await controller.searchSongs(query, category)
      setResults(res)
      setIsLoading(false)
    }, 350)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, category])

  const queueIds = new Set(queue.map(q => q.song.id))

  async function handleAdd(song: Song) {
    await controller.addToQueue(song)
    setAdded(prev => new Set(prev).add(song.id))
    setTimeout(() => setAdded(prev => { const s = new Set(prev); s.delete(song.id); return s }), 2000)
  }

  // Show categories if no query, results if has query
  const showPrompt = !query && category === 'ทั้งหมด'

  return (
    <div className="flex flex-col h-screen pb-28 animate-fade-in">

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเพลง / ศิลปิน..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={cn(
              'w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm',
              'glass-card text-text-primary placeholder:text-text-muted',
              'border border-glass-border outline-none',
              'focus:border-accent-purple transition-colors'
            )}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn w-7 h-7 text-text-muted"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {SONG_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'category-chip shrink-0',
              category === cat ? 'category-chip-active' : 'category-chip-idle'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {isLoading && (
          <div className="flex justify-center pt-10">
            <Loader2 size={28} className="animate-spin text-accent-purple" />
          </div>
        )}

        {showPrompt && !isLoading && (
          <div className="text-center pt-16 space-y-2">
            <p className="text-4xl">🎤</p>
            <p className="text-text-secondary text-sm">พิมพ์ชื่อเพลงหรือเลือกหมวดหมู่</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <ul className="space-y-2 animate-fade-in">
            {results.map(song => {
              const inQueue  = queueIds.has(song.id)
              const justAdded = added.has(song.id)
              return (
                <li key={song.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
                  {/* Lang badge */}
                  <span className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                    LANG_COLOR[song.language] ?? 'bg-glass-strong text-text-secondary'
                  )}>
                    {song.language}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate flex items-center gap-1.5">
                      {song.title}
                      {song.isNew && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink">
                          NEW
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
                      <span className="truncate">{song.artist}</span>
                      <span className="text-text-muted shrink-0">· {formatDuration(song.duration)}</span>
                    </p>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => handleAdd(song)}
                    disabled={justAdded}
                    className={cn(
                      'icon-btn w-9 h-9 shrink-0 transition-all',
                      justAdded
                        ? 'bg-status-online/20 text-status-online'
                        : inQueue
                          ? 'bg-accent-purple/20 text-accent-purple'
                          : 'bg-accent-purple text-white shadow-glow-sm active:scale-90'
                    )}
                  >
                    {justAdded ? <Check size={16} /> : <Plus size={18} />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {!isLoading && results.length === 0 && query && (
          <div className="text-center pt-16 space-y-2">
            <p className="text-4xl">🔍</p>
            <p className="text-text-secondary text-sm">ไม่พบเพลงที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  )
}

const LANG_COLOR: Record<string, string> = {
  TH: 'bg-[#D97706]/20 text-[#FCD34D]',
  EN: 'bg-[#2563EB]/20 text-[#93C5FD]',
  JP: 'bg-[#DC2626]/20 text-[#FCA5A5]',
  KR: 'bg-[#7C3AED]/20 text-[#C4B5FD]',
  CN: 'bg-[#059669]/20 text-[#6EE7B7]',
}
