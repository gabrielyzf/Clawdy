'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, defaultState } from '../storage'
import { AppState } from '../types'
import Navigation from '../components/Navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const s = loadState()
    setState(s)
  }, [])

  const resetData = () => {
    saveState(defaultState)
    router.replace('/onboarding')
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        </div>

        {/* Profile */}
        {state.profile && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">Profile</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{state.profile.name}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{state.profile.lifeFocus}</div>
            </div>
            {state.profile.focusAreas.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {state.profile.focusAreas.map(area => (
                  <span key={area} className="tag">{area}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">Your Data</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Visions', value: state.visions.length },
              { label: 'Rituals', value: state.rituals.length },
              { label: 'Beliefs', value: state.beliefs.length },
              { label: 'Evidence', value: state.evidence.length },
              { label: 'Opportunities', value: state.opportunities.length },
              { label: 'Dialogues', value: state.futureSelfMessages.length },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--bg-warm)', borderRadius: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">Data Management</div>
          {!confirmReset ? (
            <button
              className="btn-ghost"
              onClick={() => setConfirmReset(true)}
              style={{ color: '#e53e3e', borderColor: '#e53e3e', width: '100%' }}
            >
              Reset all data
            </button>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>
                Are you sure? This will permanently delete all your visions, rituals, beliefs, and evidence. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>Cancel</button>
                <button
                  onClick={resetData}
                  style={{ flex: 1, background: '#e53e3e', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
                >
                  Yes, reset everything
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="card" style={{ background: 'var(--bg-warm)' }}>
          <div className="section-title">Disclaimer</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This app is designed for reflection, clarity, and intentional action. It does not guarantee outcomes and is not a substitute for professional medical, psychological, financial, or legal advice.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
            All data is stored locally on your device and is never sent to any server.
          </p>
        </div>
      </div>
    </div>
  )
}
