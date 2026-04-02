'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wifi, Home, Store, ArrowRight, Loader2 } from 'lucide-react'
import { controller } from '@/lib/triggers'
import { useConnectionStore } from '@/lib/store/connectionStore'
import { cn } from '@/lib/utils'
import type { AppMode } from '@/lib/types'

type Step = 'mode' | 'connect' | 'connecting'

export default function SetupPage() {
  const router = useRouter()
  const { setMode } = useConnectionStore()
  const [step, setStep]     = useState<Step>('mode')
  const [mode, setModeLocal] = useState<AppMode>('shop')
  const [ip, setIp]         = useState('192.168.1.1')

  async function handleConnect() {
    setStep('connecting')
    setMode(mode)
    await controller.connect({ mode, serverIp: ip })
    router.replace('/now-playing')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8 animate-fade-in">
      {/* Logo */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-purple to-accent-pink mx-auto flex items-center justify-center text-4xl shadow-glow-md mb-4">
          🎤
        </div>
        <h1 className="text-2xl font-bold text-text-primary">RD Pad</h1>
        <p className="text-text-secondary text-sm mt-1">MBOX Karaoke Controller</p>
      </div>

      {/* Step: Mode */}
      {step === 'mode' && (
        <div className="w-full space-y-4 animate-slide-up">
          <p className="text-center text-text-secondary text-sm">เลือกประเภทการใช้งาน</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'home' as AppMode, icon: Home,  label: 'บ้าน',    sub: 'ใช้ที่บ้าน' },
              { value: 'shop' as AppMode, icon: Store, label: 'ร้านค้า', sub: '1–50 ห้อง'  },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setModeLocal(opt.value)}
                className={cn(
                  'glass-card rounded-2xl py-5 flex flex-col items-center gap-2 transition-all active:scale-95',
                  mode === opt.value && 'border-accent-purple shadow-glow-sm'
                )}
              >
                <opt.icon
                  size={28}
                  className={mode === opt.value ? 'text-accent-purple' : 'text-text-secondary'}
                />
                <span className="text-sm font-semibold text-text-primary">{opt.label}</span>
                <span className="text-xs text-text-secondary">{opt.sub}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('connect')} className="btn-pill-primary w-full py-4 flex items-center justify-center gap-2">
            ถัดไป <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Step: Connect */}
      {step === 'connect' && (
        <div className="w-full space-y-4 animate-slide-up">
          <p className="text-center text-text-secondary text-sm">ใส่ IP ของ Server</p>
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <Wifi size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              value={ip}
              onChange={e => setIp(e.target.value)}
              placeholder="192.168.1.x"
              className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted font-mono"
            />
          </div>
          <p className="text-center text-xs text-text-muted">ต้องอยู่บน WiFi เดียวกับ MBOX</p>
          <button onClick={handleConnect} className="btn-pill-primary w-full py-4 flex items-center justify-center gap-2">
            เชื่อมต่อ <ArrowRight size={18} />
          </button>
          <button onClick={() => setStep('mode')} className="w-full text-center text-text-muted text-sm py-2">
            ← ย้อนกลับ
          </button>
        </div>
      )}

      {/* Step: Connecting */}
      {step === 'connecting' && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 size={40} className="animate-spin text-accent-purple" />
          <p className="text-text-secondary text-sm">กำลังเชื่อมต่อ {ip}...</p>
        </div>
      )}
    </div>
  )
}
