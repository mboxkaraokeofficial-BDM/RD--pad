import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'
import FloatingPlayer from '@/components/layout/FloatingPlayer'

export const metadata: Metadata = {
  title: 'RD Pad — MBOX Karaoke Controller',
  description: 'Control your MBOX karaoke system from any browser',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#09090F',
}

const MAIN_PAGES = ['/now-playing', '/search', '/queue', '/effect', '/profile']

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="bg-bg-base text-text-primary min-h-screen antialiased">
        {/* Ambient background glow */}
        <div className="ambient-bg" aria-hidden />

        {/* Page content — pb accounts for mini-player + nav height */}
        <main className="relative z-10 mx-auto max-w-sm min-h-screen pb-[148px]">
          {children}
        </main>

        {/* Floating mini-player — bottom, above nav (Spotify style) */}
        <FloatingPlayer />

        {/* Bottom navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
