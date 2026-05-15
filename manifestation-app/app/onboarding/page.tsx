'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId } from '../storage'
import { UserProfile, Vision, VisionCategory, EnergyState } from '../types'

const ENERGY_OPTIONS: { value: EnergyState; emoji: string; label: string }[] = [
  { value: 'Calm', emoji: '🌊', label: 'Calm' },
  { value: 'Focused', emoji: '🎯', label: 'Focused' },
  { value: 'Anxious', emoji: '⚡', label: 'Anxious' },
  { value: 'Expansive', emoji: '🌅', label: 'Expansive' },
  { value: 'Tired', emoji: '🌙', label: 'Tired' },
  { value: 'Grateful', emoji: '🙏', label: 'Grateful' },
]

const CATEGORIES: VisionCategory[] = ['Career', 'Wealth', 'Health', 'Relationship', 'Creativity', 'Lifestyle', 'Spirituality', 'Other']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [lifeFocus, setLifeFocus] = useState('')
  const [focusAreas, setFocusAreas] = useState<VisionCategory[]>([])
  const [energyState, setEnergyState] = useState<EnergyState>('Calm')
  const [visionTitle, setVisionTitle] = useState('')
  const [visionFuture, setVisionFuture] = useState('')
  const [visionIdentity, setVisionIdentity] = useState('')

  const toggleArea = (cat: VisionCategory) => {
    setFocusAreas(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : prev.length < 3 ? [...prev, cat] : prev
    )
  }

  const finish = () => {
    const state = loadState()
    const now = new Date().toISOString()
    const profile: UserProfile = {
      id: genId(),
      name,
      lifeFocus,
      focusAreas,
      emotionalState: energyState,
      onboardingComplete: true,
      createdAt: now,
    }
    const visions: Vision[] = []
    if (visionTitle || visionFuture) {
      visions.push({
        id: genId(),
        title: visionTitle || 'My First Vision',
        category: focusAreas[0] || 'Other',
        desiredFutureState: visionFuture,
        whyItMatters: '',
        identityStatement: visionIdentity,
        emotionalSignature: '',
        milestone90Day: '',
        firstVisibleProof: '',
        alignedActions: [],
        possibleResistance: '',
        reframedBelief: '',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
    }
    saveState({ ...state, profile, visions: [...state.visions, ...visions] })
    router.push('/')
  }

  const canNext = () => {
    if (step === 1) return name.trim().length > 0
    if (step === 2) return lifeFocus.trim().length > 0
    if (step === 3) return focusAreas.length > 0
    return true
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 2,
              background: i <= step ? '#1a1a1a' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div className="card">
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Step 1 of 5</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>What should I call you?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Let&apos;s make this personal.</p>
              <div style={{ marginBottom: 20 }}>
                <label>Your name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && canNext() && setStep(2)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Step 2 of 5</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>What are you most focused on right now?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>In your own words — your life&apos;s current chapter.</p>
              <div style={{ marginBottom: 20 }}>
                <label>Your focus</label>
                <textarea
                  value={lifeFocus}
                  onChange={e => setLifeFocus(e.target.value)}
                  placeholder="e.g. Building a business while finding balance, growing financially and personally..."
                  rows={3}
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Step 3 of 5</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Which areas are calling you?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Pick up to 3 focus areas.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleArea(cat)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: `2px solid ${focusAreas.includes(cat) ? '#1a1a1a' : 'var(--border)'}`,
                      background: focusAreas.includes(cat) ? '#1a1a1a' : 'white',
                      color: focusAreas.includes(cat) ? 'white' : 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Step 4 of 5</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>How are you feeling right now?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>No judgment — just awareness.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                {ENERGY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setEnergyState(opt.value)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: 12,
                      border: `2px solid ${energyState === opt.value ? '#1a1a1a' : 'var(--border)'}`,
                      background: energyState === opt.value ? '#1a1a1a' : 'white',
                      color: energyState === opt.value ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Step 5 of 5</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Name one vision</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Just a start — you can add more later.</p>
              <div style={{ marginBottom: 16 }}>
                <label>Vision title</label>
                <input
                  value={visionTitle}
                  onChange={e => setVisionTitle(e.target.value)}
                  placeholder="e.g. Build a thriving creative business"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Describe your desired future state</label>
                <textarea
                  value={visionFuture}
                  onChange={e => setVisionFuture(e.target.value)}
                  placeholder="What does it look like when this is real?"
                  rows={3}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label>Identity statement</label>
                <input
                  value={visionIdentity}
                  onChange={e => setVisionIdentity(e.target.value)}
                  placeholder="I am someone who..."
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {step > 1 && (
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < 5 ? (
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={() => canNext() && setStep(s => s + 1)}
                disabled={!canNext()}
              >
                Continue →
              </button>
            ) : (
              <button className="btn-primary" style={{ flex: 2 }} onClick={finish}>
                Start my journey ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
