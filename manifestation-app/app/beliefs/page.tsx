'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId, todayStr } from '../storage'
import { AppState, BeliefAudit } from '../types'
import Navigation from '../components/Navigation'

const STEPS = [
  { field: 'want', label: 'What do you want?', placeholder: 'Be specific — what outcome are you trying to create?' },
  { field: 'secretBelief', label: 'What do you secretly believe about whether you can have it?', placeholder: 'The honest, unfiltered belief underneath the surface...' },
  { field: 'beliefOrigin', label: 'Where did this belief come from?', placeholder: 'A childhood experience, a past failure, something you were told...' },
  { field: 'beliefProtects', label: 'What does holding this belief protect you from?', placeholder: 'What risk, rejection, or disappointment does it keep you safe from?' },
  { field: 'powerfulBelief', label: 'What would a more powerful belief be?', placeholder: 'Write the belief that would actually serve you...' },
  { field: 'proofAction', label: 'What action would prove you believe the new belief?', placeholder: 'One specific action that only someone with the new belief would take...' },
]

export default function BeliefsPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ want: '', secretBelief: '', beliefOrigin: '', beliefProtects: '', powerfulBelief: '', proofAction: '' })

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) { router.replace('/onboarding'); return }
    setState(s)
  }, [router])

  const save = () => {
    if (!state) return
    const audit: BeliefAudit = {
      id: genId(),
      ...form,
      createdAt: new Date().toISOString(),
    }
    const newState = { ...state, beliefs: [...state.beliefs, audit] }
    saveState(newState)
    setState(newState)
    setShowForm(false)
    setStep(0)
    setForm({ want: '', secretBelief: '', beliefOrigin: '', beliefProtects: '', powerfulBelief: '', proofAction: '' })
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const currentStep = STEPS[step]

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Belief Audits</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{state.beliefs.length} audit{state.beliefs.length !== 1 ? 's' : ''} completed</p>
          </div>
          {!showForm && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: 14 }} onClick={() => setShowForm(true)}>
              + New Audit
            </button>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: i <= step ? '#1a1a1a' : 'var(--border)',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Step {step + 1} of {STEPS.length}</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>{currentStep.label}</h3>
            <textarea
              value={form[currentStep.field as keyof typeof form]}
              onChange={e => setForm(prev => ({ ...prev, [currentStep.field]: e.target.value }))}
              placeholder={currentStep.placeholder}
              rows={4}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {step > 0 ? (
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>← Back</button>
              ) : (
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
              )}
              {step < STEPS.length - 1 ? (
                <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(s => s + 1)}>Continue →</button>
              ) : (
                <button className="btn-primary" style={{ flex: 2 }} onClick={save}>Save audit ✦</button>
              )}
            </div>
          </div>
        )}

        {state.beliefs.length === 0 && !showForm ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🧠</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>A belief becomes stronger when you act from it.</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
              Start with the belief that&apos;s been blocking your biggest vision.
            </p>
            <button className="btn-secondary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setShowForm(true)}>
              Begin a belief audit →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {state.beliefs.map(b => (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{b.want}</div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.createdAt.split('T')[0]}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: 'var(--bg-peach)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Old belief</div>
                    <p style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{b.secretBelief}</p>
                  </div>
                  <div style={{ fontSize: 18 }}>→</div>
                  <div style={{ flex: 1, background: 'var(--bg-blue)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New belief</div>
                    <p style={{ fontSize: 13, lineHeight: 1.4, fontStyle: 'italic' }}>{b.powerfulBelief}</p>
                  </div>
                </div>
                {b.proofAction && (
                  <div style={{ background: 'var(--bg-warm)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proof action</div>
                    <p style={{ fontSize: 13, lineHeight: 1.4 }}>{b.proofAction}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
