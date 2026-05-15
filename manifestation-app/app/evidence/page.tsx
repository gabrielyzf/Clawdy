'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId, todayStr, getEvidenceStreak } from '../storage'
import { AppState, Evidence, EvidenceType } from '../types'
import Navigation from '../components/Navigation'

const EVIDENCE_TYPES: EvidenceType[] = ['Synchronicity', 'Opportunity', 'Compliment', 'Progress', 'Inner Shift', 'External Result']

const typeColors: Record<string, string> = {
  'Synchronicity': '#EDE8F5',
  'Opportunity': '#E8EEF5',
  'Compliment': '#F5E8EE',
  'Progress': '#E8F5EE',
  'Inner Shift': '#EEE8F5',
  'External Result': '#E8F5EE',
}

export default function EvidencePage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<'list' | 'timeline'>('list')
  const [filterType, setFilterType] = useState<EvidenceType | 'All'>('All')
  const [form, setForm] = useState({ evidenceType: 'Synchronicity' as EvidenceType, whatHappened: '', whyItMatters: '', nextAction: '', relatedVisionId: '' })

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) { router.replace('/onboarding'); return }
    setState(s)
  }, [router])

  const save = () => {
    if (!state || !form.whatHappened.trim()) return
    const ev: Evidence = {
      id: genId(),
      date: todayStr(),
      relatedVisionId: form.relatedVisionId || undefined,
      evidenceType: form.evidenceType,
      whatHappened: form.whatHappened,
      whyItMatters: form.whyItMatters,
      nextAction: form.nextAction,
      createdAt: new Date().toISOString(),
    }
    const newState = { ...state, evidence: [...state.evidence, ev] }
    saveState(newState)
    setState(newState)
    setShowForm(false)
    setForm({ evidenceType: 'Synchronicity', whatHappened: '', whyItMatters: '', nextAction: '', relatedVisionId: '' })
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const streak = getEvidenceStreak(state.evidence)
  const filtered = filterType === 'All' ? state.evidence : state.evidence.filter(e => e.evidenceType === filterType)
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  // Group by week for timeline view
  const groupedByWeek: Record<string, Evidence[]> = {}
  if (view === 'timeline') {
    sorted.forEach(e => {
      const d = new Date(e.date)
      const monday = new Date(d)
      monday.setDate(d.getDate() - d.getDay() + 1)
      const weekKey = monday.toISOString().split('T')[0]
      if (!groupedByWeek[weekKey]) groupedByWeek[weekKey] = []
      groupedByWeek[weekKey].push(e)
    })
  }

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Evidence Loop</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Notice what reality is already showing you.</p>
          </div>
          {!showForm && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: 14 }} onClick={() => setShowForm(true)}>
              + Add
            </button>
          )}
        </div>

        {/* Streak banner */}
        <div className="card" style={{ marginBottom: 16, background: streak > 0 ? 'var(--bg-warm)' : 'white', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{streak}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {streak > 0 ? `day${streak !== 1 ? 's' : ''} of noticing what&apos;s working` : 'Start your evidence streak today'}
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>Add evidence</h3>
            <div style={{ marginBottom: 14 }}>
              <label>Evidence type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EVIDENCE_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, evidenceType: t }))}
                    style={{
                      padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      border: `2px solid ${form.evidenceType === t ? '#1a1a1a' : 'var(--border)'}`,
                      background: form.evidenceType === t ? '#1a1a1a' : 'white',
                      color: form.evidenceType === t ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>What happened? *</label>
              <textarea value={form.whatHappened} onChange={e => setForm(f => ({ ...f, whatHappened: e.target.value }))} placeholder="Describe the evidence you noticed..." rows={3} autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Why it matters</label>
              <input value={form.whyItMatters} onChange={e => setForm(f => ({ ...f, whyItMatters: e.target.value }))} placeholder="What does this mean for your vision?" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label>Next action</label>
              <input value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))} placeholder="What will you do in response?" />
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
              <button className="btn-primary" style={{ flex: 2 }} onClick={save} disabled={!form.whatHappened.trim()}>Save evidence ✦</button>
            </div>
          </div>
        )}

        {/* View toggle + filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12, background: view === 'list' ? 'var(--bg-warm)' : 'transparent' }} onClick={() => setView('list')}>List</button>
            <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12, background: view === 'timeline' ? 'var(--bg-warm)' : 'transparent' }} onClick={() => setView('timeline')}>Timeline</button>
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value as EvidenceType | 'All')} style={{ width: 'auto', fontSize: 13, padding: '6px 12px' }}>
            <option value="All">All types</option>
            {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {sorted.length === 0 && !showForm ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>👁️</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Notice what reality is already showing you.</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>Every piece of evidence strengthens your belief that your vision is inevitable.</p>
          </div>
        ) : view === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map(e => (
              <div key={e.id} className="card-sm" style={{ background: typeColors[e.evidenceType] || 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="tag" style={{ fontSize: 11 }}>{e.evidenceType}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.date}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>{e.whatHappened}</p>
                {e.whyItMatters && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{e.whyItMatters}</p>}
                {e.nextAction && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>→ {e.nextAction}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {Object.entries(groupedByWeek).sort(([a], [b]) => b.localeCompare(a)).map(([week, items]) => (
              <div key={week} style={{ marginBottom: 20 }}>
                <div className="section-title">Week of {week}</div>
                {items.map(e => (
                  <div key={e.id} className="card-sm" style={{ marginBottom: 8, background: typeColors[e.evidenceType] || 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="tag" style={{ fontSize: 11 }}>{e.evidenceType}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.date}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.5 }}>{e.whatHappened}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
