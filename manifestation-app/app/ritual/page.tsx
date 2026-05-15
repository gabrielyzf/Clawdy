'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId, todayStr, getTodayRitual } from '../storage'
import { AppState, DailyRitual, EnergyState } from '../types'
import { getTodayPrompt } from '../data/prompts'
import Navigation from '../components/Navigation'

const ENERGY_OPTIONS: { value: EnergyState; emoji: string; label: string; desc: string }[] = [
  { value: 'Calm', emoji: '🌊', label: 'Calm', desc: 'Grounded and at peace' },
  { value: 'Focused', emoji: '🎯', label: 'Focused', desc: 'Clear and productive' },
  { value: 'Anxious', emoji: '⚡', label: 'Anxious', desc: 'Unsettled or restless' },
  { value: 'Expansive', emoji: '🌅', label: 'Expansive', desc: 'Open and inspired' },
  { value: 'Tired', emoji: '🌙', label: 'Tired', desc: 'Low energy today' },
  { value: 'Grateful', emoji: '🙏', label: 'Grateful', desc: 'Appreciative and warm' },
]

export default function RitualPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [step, setStep] = useState(1)
  const [energy, setEnergy] = useState<EnergyState>('Calm')
  const [promptResponse, setPromptResponse] = useState('')
  const [committedAction, setCommittedAction] = useState('')
  const [gratitude, setGratitude] = useState(['', '', ''])
  const [complete, setComplete] = useState(false)
  const prompt = getTodayPrompt()

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) {
      router.replace('/onboarding')
      return
    }
    setState(s)
    const existing = getTodayRitual(s.rituals)
    if (existing) setComplete(true)
  }, [router])

  const save = () => {
    if (!state) return
    const ritual: DailyRitual = {
      id: genId(),
      date: todayStr(),
      energyState: energy,
      topVisionId: state.visions.filter(v => v.isActive)[0]?.id,
      promptUsed: prompt,
      promptResponse,
      committedAction,
      gratitude: gratitude.filter(g => g.trim()),
      completedAt: new Date().toISOString(),
    }
    const newState = { ...state, rituals: [...state.rituals, ritual] }
    saveState(newState)
    setState(newState)
    setComplete(true)
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const topVision = state.visions.filter(v => v.isActive)[0]

  if (complete) {
    return (
      <div className="main-with-sidebar">
        <Navigation />
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ritual Complete</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              You&apos;ve shown up for yourself today. That&apos;s what builds the life you&apos;re creating.
            </p>
            <button className="btn-primary" onClick={() => router.push('/')}>Back to home</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Daily Ritual</p>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Morning Practice</h1>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 2,
              background: i <= step ? '#1a1a1a' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>How are you arriving today?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              Check in with your energy before we begin.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {ENERGY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setEnergy(opt.value)}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 12,
                    border: `2px solid ${energy === opt.value ? '#1a1a1a' : 'var(--border)'}`,
                    background: energy === opt.value ? '#1a1a1a' : 'white',
                    color: energy === opt.value ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{opt.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStep(2)}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Your active vision</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              Hold this in mind as you continue.
            </p>
            {topVision ? (
              <div style={{ background: 'var(--bg-warm)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <span className="tag" style={{ marginBottom: 12 }}>{topVision.category}</span>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{topVision.title}</div>
                {topVision.identityStatement && (
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    &ldquo;{topVision.identityStatement}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-warm)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <p style={{ color: 'var(--text-muted)' }}>No active visions yet. Create one after this ritual.</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>I&apos;ve read it →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div style={{ background: 'var(--bg-lavender)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div className="section-title">Today&apos;s Prompt</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{prompt}&rdquo;</p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label>Your response</label>
              <textarea
                value={promptResponse}
                onChange={e => setPromptResponse(e.target.value)}
                placeholder="Write freely... what comes up?"
                rows={5}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Commit to one action</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              What&apos;s the one thing you&apos;ll do today that moves your vision forward?
            </p>
            <div style={{ marginBottom: 24 }}>
              <label>Committed action</label>
              <input
                value={committedAction}
                onChange={e => setCommittedAction(e.target.value)}
                placeholder="e.g. Send that email I've been avoiding"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(3)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(5)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Three things you&apos;re grateful for</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              Gratitude primes your mind to notice more to be grateful for.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {gratitude.map((g, i) => (
                <div key={i}>
                  <label>Gratitude {i + 1}</label>
                  <input
                    value={g}
                    onChange={e => {
                      const next = [...gratitude]
                      next[i] = e.target.value
                      setGratitude(next)
                    }}
                    placeholder={i === 0 ? 'I am grateful for...' : i === 1 ? 'Something simple...' : 'Something about yourself...'}
                    autoFocus={i === 0}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(4)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={save}>Complete ritual ✦</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
