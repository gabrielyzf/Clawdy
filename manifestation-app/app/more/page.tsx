'use client'
import Link from 'next/link'
import Navigation from '../components/Navigation'

const items = [
  { href: '/beliefs', icon: '🧠', label: 'Beliefs', desc: 'Audit and reframe limiting beliefs' },
  { href: '/opportunities', icon: '📡', label: 'Opportunities', desc: 'Capture and test ideas in 48 hours' },
  { href: '/future-self', icon: '🔮', label: 'Future Self', desc: 'Ask the version of you who has it all' },
  { href: '/settings', icon: '⚙️', label: 'Settings', desc: 'Profile, data, and disclaimers' },
]

export default function MorePage() {
  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>More</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 28, width: 48, height: 48, borderRadius: 12, background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 18 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
