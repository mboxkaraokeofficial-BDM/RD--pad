'use client'
import { useEffect, useRef, useState } from 'react'
import { Search, X, Plus, Check, Loader2, ChevronRight } from 'lucide-react'
import { useSearchStore } from '@/lib/store/searchStore'
import { useQueueStore } from '@/lib/store/queueStore'
import { controller } from '@/lib/triggers'
import { MOCK_SONGS, SONG_CATEGORIES, formatDuration } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Song } from '@/lib/types'

// ─── Deterministic gradient avatar (zero network requests) ───────────────────
const GRADIENTS = [
  ['#7C3AED', '#EC4899'],
  ['#0EA5E9', '#6366F1'],
  ['#10B981', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#8B5CF6', '#06B6D4'],
  ['#EC4899', '#F97316'],
  ['#14B8A6', '#8B5CF6'],
  ['#F43F5E', '#A855F7'],
]
function songGradient(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff
  const [a, b] = GRADIENTS[h % GRADIENTS.length]
  return `linear-gradient(135deg, ${a}, ${b})`
}

// ─── Category browse grid config ──────────────────────────────────────────────
const CAT_META: Record<string, { emoji: string; from: string; to: string }> = {
  'ลูกทุ่ง':  { emoji: '🎤', from: '#D97706', to: '#EA580C' },
  'สตริง':    { emoji: '🎸', from: '#7C3AED', to: '#6D28D9' },
  'สากล':     { emoji: '🌍', from: '#2563EB', to: '#0891B2' },
  'เพลงใหม่': { emoji: '✨', from: '#DB2777', to: '#E11D48' },
  'ฮิต':      { emoji: '🔥', from: '#DC2626', to: '#BE185D' },
  'ลูกกรุง':  { emoji: '🎼', from: '#0D9488', to: '#059669' },
  'เพลงช้า':  { emoji: '🎵', from: '#4F46E5', to: '#2563EB' },
  'ญี่ปุ่น':  { emoji: '🗾', from: '#B91C1C', to: '#9F1239' },
  'เกาหลี':   { emoji: '🎶', from: '#7C3AED', to: '#A855F7' },
}

// ─── Section data ─────────────────────────────────────────────────────────────
const HIT_IDS = new Set(['TH001','TH004','TH009','TH011','EN001','EN002','KR001'])
const HIT_SONGS = MOCK_SONGS.filter(s => HIT_IDS.has(s.id))
const NEW_SONGS  = MOCK_SONGS.filter(s => s.isNew)

// ─── Song row ─────────────────────────────────────────────────────────────────
function SongRow({ song, inQueue, justAdded, onAdd }: {
  song: Song; inQueue: boolean; justAdded: boolean; onAdd: (s: Song) => void
}) {
  return (
    <li className="flex items-center gap-3 px-1 py-2 rounded-xl hover:bg-white/[0.06] active:bg-white/10 transition-colors">
      <div
        className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-bold text-white/90 shadow"
        style={{ background: songGradient(song.id) }}
      >
        {song.language}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-snug flex items-center gap-1.5">
          {song.title}
          {song.isNew && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink leading-none shrink-0">
              NEW
            </span>
          )}
        </p>
        <p className="text-xs text-text-muted mt-0.5 truncate">
          {song.artist}
          <span className="mx-1 opacity-40">·</span>
          {formatDuration(song.duration)}
        </p>
      </div>

      <button
        onClick={() => onAdd(song)}
        disabled={justAdded}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
          justAdded
            ? 'bg-emerald-500/20 text-emerald-400'
            : inQueue
              ? 'bg-accent-purple/20 text-accent-purple'
              : 'bg-white/10 text-white/60 hover:bg-accent-purple hover:text-white active:scale-90'
        )}
      >
        {justAdded ? <Check size={14} /> : <Plus size={15} />}
      </button>
    </li>
  )
}

function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-0.5 text-xs text-text-muted hover:text-accent-purple transition-colors"
        >
          ดูทั้งหมด <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const { query, category, results, isLoading,
    setQuery, setCategory, setResults, setIsLoading } = useSearchStore()
  const { queue } = useQueueStore()
  const [added, setAdded] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query && category === 'ทั้งหมด') {
      setResults([]); setIsLoading(false); return
    }
    setIsLoading(true)
    timerRef.current = setTimeout(async () => {
      const res = await controller.searchSongs(query, category)
      setResults(res); setIsLoading(false)
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, category])

  const queueIds = new Set(queue.map(q => q.song.id))
  const isBrowse = !query && category === 'ทั้งหมด'

  function handleAdd(song: Song) {
    controller.addToQueue(song)
    setAdded(prev => new Set(prev).add(song.id))
    setTimeout(() => setAdded(prev => { const s = new Set(prev); s.delete(song.id); return s }), 2000)
  }

  return (
    <div className="flex flex-col h-[100dvh] pb-[148px]">

      {/* Search bar */}
      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="ชื่อเพลง / ศิลปิน..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={cn(
              'w-full pl-9 pr-8 py-2.5 rounded-xl text-sm',
              'bg-white/[0.08] text-white placeholder:text-text-muted',
              'border border-white/10 outline-none',
              'focus:border-accent-purple/50 focus:bg-white/[0.10] transition-all'
            )}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div
        className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 shrink-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {SONG_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap',
              category === cat
                ? 'bg-accent-purple text-white'
                : 'bg-white/[0.07] text-text-muted border border-white/[0.08] hover:border-white/20 hover:text-white/70'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4" style={{ scrollbarWidth: 'none' }}>

        {isLoading && (
          <div className="flex justify-center pt-14">
            <Loader2 size={24} className="animate-spin text-accent-purple/60" />
          </div>
        )}

        {/* ── BROWSE (no query, all categories) ── */}
        {isBrowse && !isLoading && (
          <div className="space-y-7 pb-4 animate-fade-in">

            {/* ฮิตในเครื่องนี้ */}
            <div>
              <SectionHeader title="🔥 ฮิตในเครื่องนี้" onViewAll={() => setCategory('ฮิต')} />
              <ul>
                {HIT_SONGS.map(s => (
                  <SongRow key={s.id} song={s} inQueue={queueIds.has(s.id)} justAdded={added.has(s.id)} onAdd={handleAdd} />
                ))}
              </ul>
            </div>

            {/* เพิ่งเพิ่มใหม่ */}
            {NEW_SONGS.length > 0 && (
              <div>
                <SectionHeader title="✨ เพิ่งเพิ่มใหม่" onViewAll={() => setCategory('เพลงใหม่')} />
                <ul>
                  {NEW_SONGS.map(s => (
                    <SongRow key={s.id} song={s} inQueue={queueIds.has(s.id)} justAdded={added.has(s.id)} onAdd={handleAdd} />
                  ))}
                </ul>
              </div>
            )}

            {/* หมวดหมู่ 2-col grid */}
            <div>
              <SectionHeader title="หมวดหมู่" />
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                {Object.entries(CAT_META).map(([cat, m]) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="relative h-[72px] rounded-2xl overflow-hidden text-left active:scale-95 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})` }}
                  >
                    <div className="absolute inset-0 bg-black/15" />
                    <span className="absolute bottom-2.5 left-3 text-sm font-bold text-white drop-shadow-sm">
                      {m.emoji} {cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {!isBrowse && !isLoading && results.length > 0 && (
          <div className="animate-fade-in pb-4">
            <p className="text-xs text-text-muted mb-2 px-1">
              พบ <span className="text-accent-purple font-semibold">{results.length}</span> เพลง
              {category !== 'ทั้งหมด' && <span className="ml-1">ในหมวด {category}</span>}
            </p>
            <ul>
              {results.map(s => (
                <SongRow key={s.id} song={s} inQueue={queueIds.has(s.id)} justAdded={added.has(s.id)} onAdd={handleAdd} />
              ))}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {!isBrowse && !isLoading && results.length === 0 && (
          <div className="flex flex-col items-center pt-20 gap-3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-text-muted text-sm text-center">
              {query ? `ไม่พบ "${query}"` : `ไม่มีเพลงในหมวด "${category}"`}
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('ทั้งหมด') }}
              className="text-xs text-accent-purple hover:underline mt-1"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
