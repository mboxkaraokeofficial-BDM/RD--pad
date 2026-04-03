'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music2, Search, ListMusic, Sparkles, Settings } from 'lucide-react'
import { useQueueStore } from '@/lib/store/queueStore'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/now-playing', icon: Music2,    label: 'เล่น'      },
  { href: '/search',      icon: Search,    label: 'ค้นหา'     },
  { href: '/queue',       icon: ListMusic, label: 'คิว',  badge: true },
  { href: '/effect',      icon: Sparkles,  label: 'เอฟเฟกต์' },
  { href: '/profile',     icon: Settings,  label: 'ตั้งค่า'   },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { queue } = useQueueStore()

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 flex justify-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <nav className="glass-nav border-t border-glass-border w-full max-w-sm shadow-nav">
        <ul className="flex items-center justify-around px-1 py-1">
          {TABS.map(({ href, icon: Icon, label, badge }) => {
            const active = pathname.startsWith(href)
            const count  = badge ? queue.length : 0

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className="flex flex-col items-center gap-1 py-2 relative"
                >
                  {/* Active indicator line — YouTube Music style */}
                  {active && (
                    <span className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-accent-teal" />
                  )}

                  {/* Icon + badge */}
                  <span className="relative">
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.5 : 1.8}
                      className={cn(
                        'transition-colors',
                        active ? 'text-accent-teal' : 'text-text-muted'
                      )}
                    />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-accent-pink text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </span>

                  {/* Label */}
                  <span className={cn(
                    'text-[10px] font-medium leading-none',
                    active ? 'text-accent-teal' : 'text-text-muted'
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
