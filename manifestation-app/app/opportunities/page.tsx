'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId } from '../storage'
import { AppState, Opportunity } from '../types'
import Navigation from '../components/Navigation'

export default function OpportunitiesPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterEnergy, setFilterEnergy] = useState(0)
  const [form, setForm] = useState({
    idea: '', whyNow: '', whoNeedsThis: '', signalNoticed: '',
    tinyTest: '', potentialUpside: '', energyLevel: 3, relatedVisionId: '',
  })

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) { router.replace('/onboarding'); return }
    setState(s)
  }, [router])

  const save = () => {
    if (!state || !form.idea.trim()) return
    const opp: Opportunity = {
      id: genId(),
      ...form,
      relatedVisionId: form.relatedVisionId || undefined,
      createdAt: new Date().toISOString(),
    }
    const newState = { ...state, opportunities: [...state.opportunities, opp] }
    saveState(newState)
    setState(newState)
    setShowForm(false)
    setForm({ idea: '', whyNow: '', whoNeedsThis: '', signalNoticed: '', tinyTest: '', potentialUpside: '', energyLevel: 3, relatedVisionId: '' })
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const filtered = filterEnergy > 0 ? state.opportunities.filter(o => o.energyLevel >= filterEnergy) : state.opportunities
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Opportunity Radar</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Every signal is an invitation.</p>
          </div>
          {!showForm && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: 14 }} onClick={() => setShowForm(true)}>
              + Capture
            </button>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>Capture an opportunity</h3>
            <div style={{ marginBottom: 14 }}>
              <label>The idea *</label>
              <input value={form.idea} onChange={e => setForm(f => ({ ...f, idea: e.target.value }))} placeholder="What did you notice or think of?" autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Why now?</label>
              <input value={form.whyNow} onChange={e => setForm(f => ({ ...f, whyNow: e.target.value }))} placeholder="What makes this timely?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Who needs this?</label>
              <input value={form.whoNeedsThis} onChange={e => setForm(f => ({ ...f, whoNeedsThis: e.target.value }))} placeholder="Who would benefit from this?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Signal you noticed</label>
              <input value={form.signalNoticed} onChange={e => setForm(f => ({ ...f, signalNoticed: e.target.value }))} placeholder="What triggered this idea?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>48-hour tiny test</label>
              <input value={form.tinyTest} onChange={e => setForm(f => ({ ...f, tinyTest: e.target.value }))} placeholder="What's the smallest possible test?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Potential upside</label>
              <input value={form.potentialUpside} onChange={e => setForm(f => ({ ...f, potentialUpside: e.target.value }))} placeholder="What's the best case if this works?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Energy level (how excited are you? 1-5)</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm(f => ({ ...f, energyLevel: n }))}
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      border: `2px solid ${form.energyLevel === n ? '#1a1a1a' : 'var(--border)'}`,
                      background: form.energyLevel === n ? '#1a1a1a' : 'white',
                      color: form.energyLevel === n ? 'white' : 'var(--text-primary)',
                      fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>
            {state.visions.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <label>Related vision (optional)</label>
                <select value={form.relatedVisionId} onChange={e => setForm(f => ({ ...f, relatedVisionId: e.target.value }))}>
                  <option value="">— None —</option>
                  {state.visions.filter(v => v.isActive).map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={save} disabled={!form.idea.trim()}>Save ✦</button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Min energy:</span>
          {[0, 1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setFilterEnergy(n)}
              style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 13,
                border: `1px solid ${filterEnergy === n ? '#1a1a1a' : 'var(--border)'}`,
                background: filterEnergy === n ? '#1a1a1a' : 'transparent',
                color: filterEnergy === n ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >{n === 0 ? 'All' : n}</button>
          ))}
        </div>

        {sorted.length === 0 && !showForm ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📡</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Every signal is an invitation.</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>What did you notice today that could be an opportunity?</p>
            <button className="btn-secondary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setShowForm(true)}>Capture one now →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {sorted.map(o => (
              <div key={o.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < o.energyLevel ? '#1a1a1a' : 'var(--border)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.createdAt.split('T')[0]}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{o.idea}</div>
                {o.tinyTest && (
                  <div style={{ background: 'var(--bg-warm)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>48h Test</div>
                    <p style={{ fontSize: 13, lineHeight: 1.4 }}>{o.tinyTest}</p>
                  </div>
                )}
                {o.potentialUpside && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>↑ {o.potentialUpside}</p>
                )}
                {o.whyNow && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Why now: {o.whyNow}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
