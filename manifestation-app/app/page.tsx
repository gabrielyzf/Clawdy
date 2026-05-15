'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadState, getTodayRitual, getEvidenceStreak, getManifestationScore } from './storage'
import { AppState } from './types'
import { getTodayPrompt } from './data/prompts'
import Navigation from './components/Navigation'

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null)
  const router = useRouter()

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) {
      router.replace('/onboarding')
      return
    }
    setState(s)
  }, [router])

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const todayRitual = getTodayRitual(state.rituals)
  const streak = getEvidenceStreak(state.evidence)
  const score = getManifestationScore(state)
  const activeVisions = state.visions.filter(v => v.isActive).slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const prompt = getTodayPrompt()

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

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{greeting}</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {state.profile?.name || 'Friend'} ✦
          </h1>
        </div>

        {/* Score + Streak row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `conic-gradient(#1a1a1a ${score * 3.6}deg, var(--border) 0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700,
              }}>{score}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Manifestation Score
            </div>
          </div>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: streak > 0 ? '#1a1a1a' : 'var(--text-muted)', marginBottom: 4 }}>
              {streak}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Evidence Streak
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>days</div>
          </div>
        </div>

        {/* Today's Ritual */}
        <div className="card" style={{ marginBottom: 16, background: todayRitual ? '#F0F5F0' : 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="section-title">Today&apos;s Ritual</div>
              {todayRitual ? (
                <>
                  <p style={{ fontSize: 15, fontWeight: 500, color: '#2a6e3f' }}>✓ Completed</p>
                  {todayRitual.committedAction && (
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
                      Action: {todayRitual.committedAction}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Not started yet</p>
                  <Link href="/ritual" style={{ display: 'inline-block', marginTop: 12 }}>
                    <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
                      Begin ritual →
                    </button>
                  </Link>
                </>
              )}
            </div>
            <div style={{ fontSize: 28 }}>{todayRitual ? '🌿' : '☀️'}</div>
          </div>
        </div>

        {/* Daily Prompt */}
        <div className="card" style={{ marginBottom: 16, background: 'var(--bg-lavender)', border: 'none' }}>
          <div className="section-title">Today&apos;s Prompt</div>
          <p style={{ fontSize: 16, lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text-primary)' }}>
            &ldquo;{prompt}&rdquo;
          </p>
          {!todayRitual && (
            <Link href="/ritual">
              <button className="btn-ghost" style={{ marginTop: 12, fontSize: 13 }}>Respond in ritual →</button>
            </Link>
          )}
        </div>

        {/* Active Visions */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Active Visions</div>
            <Link href="/visions" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>See all →</Link>
          </div>
          {activeVisions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Your future is waiting to be named.</p>
              <Link href="/visions/new">
                <button className="btn-secondary" style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
                  Create your first vision →
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeVisions.map(v => (
                <Link key={v.id} href={`/visions/${v.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card-sm" style={{ background: categoryColors[v.category] || '#F5F5F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <span className="tag" style={{ marginBottom: 8, fontSize: 11 }}>{v.category}</span>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{v.title}</div>
                        {v.identityStatement && (
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {v.identityStatement.slice(0, 80)}{v.identityStatement.length > 80 ? '…' : ''}
                          </div>
                        )}
                      </div>
                      <div style={{ marginLeft: 12, fontSize: 18 }}>→</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <div className="section-title">Quick Add</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Link href="/evidence" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }}>+ Evidence</button>
            </Link>
            <Link href="/opportunities" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }}>+ Opportunity</button>
            </Link>
            <Link href="/beliefs" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }}>+ Belief Audit</button>
            </Link>
            <Link href="/future-self" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }}>Ask Future Self</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
