'use client'
import { useState } from 'react'
import { MOCK_EFFECTS } from '@/lib/mock-data'
import { controller } from '@/lib/triggers'
import { cn } from '@/lib/utils'

export default function EffectPage() {
  const [pressed, setPressed] = useState<string | null>(null)
  const [effectVolume, setEffectVolume] = useState(70)

  function handlePress(id: string) {
    setPressed(id)
    controller.playEffect(id)
    setTimeout(() => setPressed(null), 400)
  }

  return (
    <div className="flex flex-col h-screen pb-28 px-4 animate-fade-in">

      {/* Header */}
      <div className="pt-4 pb-4">
        <h1 className="text-xl font-bold text-text-primary">Sound Effects</h1>
        <p className="text-xs text-text-secondary mt-0.5">กดเพื่อเล่นเสียงเอฟเฟกต์</p>
      </div>

      {/* Volume effect */}
      <div className="glass-card rounded-2xl px-4 py-3 mb-5 flex items-center gap-3">
        <span className="text-base shrink-0">🔊</span>
        <span className="text-xs text-text-secondary w-14 shrink-0">Effect</span>
        <input
          type="range"
          min={0} max={100}
          value={effectVolume}
          onChange={e => {
            const v = Number(e.target.value)
            setEffectVolume(v)
            controller.setVolumeEffect(v)
          }}
          style={{ accentColor: '#A855F7' }}
          className="flex-1"
        />
        <span className="text-xs font-semibold text-text-secondary w-7 text-right tabular-nums shrink-0">
          {effectVolume}
        </span>
      </div>

      {/* Effect grid */}
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-2">
        {MOCK_EFFECTS.map(effect => (
          <button
            key={effect.id}
            onClick={() => handlePress(effect.id)}
            className={cn(
              'glass-card rounded-3xl py-5 flex flex-col items-center justify-center gap-2',
              'border transition-all duration-150 active:scale-90',
              pressed === effect.id
                ? 'border-current scale-95'
                : 'border-glass-border'
            )}
            style={{
              boxShadow: pressed === effect.id
                ? `0 0 20px ${effect.color}60`
                : undefined,
              borderColor: pressed === effect.id ? effect.color : undefined,
            }}
          >
            <span
              className={cn(
                'text-4xl transition-transform',
                pressed === effect.id && 'scale-125'
              )}
            >
              {effect.emoji}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: pressed === effect.id ? effect.color : 'rgba(255,255,255,0.5)' }}
            >
              {effect.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
