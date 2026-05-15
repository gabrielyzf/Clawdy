'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadState, getManifestationScore } from '../storage'
import { AppState } from '../types'
import Navigation from '../components/Navigation'

const categoryColors: Record<string, string> = {
  Career: '#E8EEF5',
  Wealth: '#E8F5EE',
  Health: '#F5EEE8',
  Relationship: '#F5E8EE',
  Creativity: '#EEE8F5',
  Lifestyle: '#F5F5E8',
  Spirituality: '#EDE8F5',
  Other: '#F0F0F0',
}

export default function VisionsPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) {
      router.replace('/onboarding')
      return
    }
    setState(s)
  }, [router])

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const activeVisions = state.visions.filter(v => v.isActive)
  const score = getManifestationScore(state)

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Visions</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{activeVisions.length} active vision{activeVisions.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{score}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
          </div>
        </div>

        {state.visions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Your future is waiting to be named.</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
              A vision gives your actions direction and your identity something to grow toward.
            </p>
            <Link href="/visions/new">
              <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>Create your first vision →</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {state.visions.map(v => (
              <Link key={v.id} href={`/visions/${v.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ background: categoryColors[v.category] || '#F5F5F5', border: v.isActive ? 'none' : '1px solid var(--border)', opacity: v.isActive ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span className="tag" style={{ fontSize: 11 }}>{v.category}</span>
                        {!v.isActive && <span className="tag" style={{ fontSize: 11, background: '#F0F0F0' }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{v.title}</div>
                      {v.identityStatement && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                          &ldquo;{v.identityStatement.slice(0, 100)}{v.identityStatement.length > 100 ? '…' : ''}&rdquo;
                        </div>
                      )}
                      {v.desiredFutureState && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
                          {v.desiredFutureState.slice(0, 80)}{v.desiredFutureState.length > 80 ? '…' : ''}
                        </div>
                      )}
                    </div>
                    <div style={{ marginLeft: 16, fontSize: 18 }}>→</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* FAB */}
        <Link href="/visions/new">
          <button style={{
            position: 'fixed',
            bottom: 88,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}>+</button>
        </Link>
      </div>
    </div>
  )
}
