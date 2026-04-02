'use client'
import { useState } from 'react'
import { LogOut, Plus, ChevronRight, Heart, Music, Settings } from 'lucide-react'
import { MOCK_USER, MOCK_PLAYLISTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [loggedIn, setLoggedIn] = useState(true)
  const user = MOCK_USER

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  return (
    <div className="flex flex-col h-screen pb-28 overflow-y-auto animate-fade-in">

      {/* Profile header */}
      <div className="relative px-4 pt-8 pb-6">
        {/* BG glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-glow-purple pointer-events-none" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-2xl font-bold text-white shadow-glow-sm">
            {user.displayName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary">{user.displayName}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                user.provider === 'line'   && 'bg-[#06C755]/20 text-[#06C755]',
                user.provider === 'google' && 'bg-[#4285F4]/20 text-[#4285F4]',
              )}>
                {user.provider === 'line' ? 'LINE' : 'Google'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setLoggedIn(false)}
            className="icon-btn w-9 h-9 text-text-muted"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Playlists', value: MOCK_PLAYLISTS.length },
            { label: 'เพลงโปรด', value: MOCK_PLAYLISTS.reduce((a, p) => a + p.songs.length, 0) },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl flex-1 py-3 text-center">
              <p className="text-lg font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Playlists */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Playlists ของฉัน
          </h2>
          <button className="btn-pill-ghost text-xs flex items-center gap-1">
            <Plus size={14} /> สร้างใหม่
          </button>
        </div>

        <div className="space-y-2">
          {MOCK_PLAYLISTS.map(pl => (
            <button
              key={pl.id}
              className="glass-card rounded-2xl px-4 py-3.5 w-full flex items-center gap-3 transition-all active:scale-[0.98]"
            >
              <span className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center shrink-0">
                <Heart size={18} className="text-accent-pink" />
              </span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-text-primary">{pl.name}</p>
                <p className="text-xs text-text-secondary">{pl.songs.length} เพลง</p>
              </div>
              <ChevronRight size={16} className="text-text-muted shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          ตั้งค่า
        </h2>
        {[
          { icon: Music,    label: 'การเชื่อมต่อ & ห้อง', sub: 'ห้อง 1 · 192.168.1.1' },
          { icon: Settings, label: 'ตั้งค่าเครื่อง',       sub: 'MBOX Echo Pro'          },
        ].map(item => (
          <button
            key={item.label}
            className="glass-card rounded-2xl px-4 py-3.5 w-full flex items-center gap-3 mb-2 active:scale-[0.98] transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-glass-strong flex items-center justify-center shrink-0">
              <item.icon size={18} className="text-text-secondary" />
            </span>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-secondary">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin(): void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-4xl shadow-glow-md">
        🎤
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary">เข้าสู่ระบบ</h1>
        <p className="text-text-secondary text-sm mt-2">เพื่อบันทึก Playlist และเพลงโปรด</p>
      </div>
      <div className="w-full space-y-3">
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-2xl bg-[#06C755] text-white font-semibold flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <span className="text-xl">💬</span> เข้าสู่ระบบด้วย LINE
        </button>
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-2xl glass-card text-text-primary font-semibold flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <span className="text-xl">🔵</span> เข้าสู่ระบบด้วย Google
        </button>
        <button
          onClick={onLogin}
          className="w-full py-3 text-text-muted text-sm active:text-text-secondary transition-colors"
        >
          ใช้เป็น Guest (ไม่บันทึก Playlist)
        </button>
      </div>
    </div>
  )
}
