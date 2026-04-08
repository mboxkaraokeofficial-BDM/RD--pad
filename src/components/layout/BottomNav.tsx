'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music2, Search, ListMusic, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/now-playing', icon: Music2,    label: 'เล่นอยู่' },
  { href: '/search',      icon: Search,    label: 'ค้นหา'   },
  { href: '/queue',       icon: ListMusic, label: 'คิว'     },
  { href: '/effect',      icon: Sparkles,  label: 'เอฟเฟกต์'},
  { href: '/profile',     icon: User,      label: 'โปรไฟล์' },
]

const HIDDEN_PATHS = ['/quote']

export default function BottomNav() {
  const pathname = usePathname()

  if (HIDDEN_PATHS.some(p => pathname.startsWith(p))) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-safe px-4 pb-3">
      <nav className="glass-nav rounded-3xl px-2 py-2 w-full max-w-sm shadow-nav">
        <ul className="flex items-center justify-around">
          {TABS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200',
                    active
                      ? 'text-white'
                      : 'text-text-muted'
                  )}
                >
                  <span className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-2xl transition-all',
                    active
                      ? 'bg-accent-purple shadow-glow-sm'
                      : 'bg-transparent'
                  )}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  </span>
                  <span className={cn(
                    'text-[10px] font-medium leading-none',
                    active ? 'text-white' : 'text-text-muted'
                  )}>
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
