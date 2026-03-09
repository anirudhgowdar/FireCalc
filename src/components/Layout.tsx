import type { ReactNode } from 'react'
import { DarkModeToggle } from './DarkModeToggle'

interface LayoutProps {
  isDark: boolean
  toggleDark: () => void
  children: ReactNode
}

export function Layout({ isDark, toggleDark, children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
      <header
        className="sticky top-0 z-10 backdrop-blur-sm"
        style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-surface) 85%, transparent)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              FIRE Calculator
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Financial Independence, Retire Early
            </p>
          </div>
          <DarkModeToggle isDark={isDark} toggle={toggleDark} />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
