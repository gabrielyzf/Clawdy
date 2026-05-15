'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/ritual',
    label: 'Ritual',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    href: '/visions',
    label: 'Visions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    href: '/evidence',
    label: 'Evidence',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    href: '/more',
    label: 'More',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </svg>
    ),
  },
]

const desktopItems = [
  { href: '/', label: 'Home' },
  { href: '/ritual', label: 'Daily Ritual' },
  { href: '/visions', label: 'Visions' },
  { href: '/evidence', label: 'Evidence' },
  { href: '/beliefs', label: 'Beliefs' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/future-self', label: 'Future Self' },
  { href: '/settings', label: 'Settings' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="desktop-sidebar">
        <div style={{ marginBottom: 24, paddingLeft: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>✦ Manifest</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Intentional Living</div>
        </div>
        {desktopItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${pathname === item.href ? ' active' : ''}`}
            style={{ flexDirection: 'row', justifyContent: 'flex-start', fontSize: 14, padding: '10px 12px', borderRadius: 8 }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <div className="bottom-nav">
        {navItems.map(item => {
          if (item.href === '/more') {
            return (
              <div key="more" style={{ position: 'relative' }}>
                <button
                  className={`nav-item${pathname === '/more' || pathname === '/beliefs' || pathname === '/opportunities' || pathname === '/future-self' ? ' active' : ''}`}
                  onClick={() => setMoreOpen(o => !o)}
                >
                  {item.icon}
                  {item.label}
                </button>
                {moreOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    padding: 8,
                    minWidth: 160,
                    marginBottom: 8,
                  }}>
                    {[
                      { href: '/beliefs', label: 'Beliefs' },
                      { href: '/opportunities', label: 'Opportunities' },
                      { href: '/future-self', label: 'Future Self' },
                      { href: '/settings', label: 'Settings' },
                    ].map(mi => (
                      <Link
                        key={mi.href}
                        href={mi.href}
                        onClick={() => setMoreOpen(false)}
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          fontSize: 14,
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          borderRadius: 8,
                          background: pathname === mi.href ? 'var(--bg-warm)' : 'transparent',
                        }}
                      >
                        {mi.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}
