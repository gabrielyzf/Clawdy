'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId } from '../../storage'
import { Vision, VisionCategory } from '../../types'
import Navigation from '../../components/Navigation'

const CATEGORIES: VisionCategory[] = ['Career', 'Wealth', 'Health', 'Relationship', 'Creativity', 'Lifestyle', 'Spirituality', 'Other']

export default function NewVisionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<VisionCategory>('Career')
  const [desiredFutureState, setDesiredFutureState] = useState('')
  const [whyItMatters, setWhyItMatters] = useState('')
  const [identityStatement, setIdentityStatement] = useState('')
  const [emotionalSignature, setEmotionalSignature] = useState('')
  const [milestone90Day, setMilestone90Day] = useState('')
  const [firstVisibleProof, setFirstVisibleProof] = useState('')
  const [alignedActions, setAlignedActions] = useState<string[]>([''])
  const [possibleResistance, setPossibleResistance] = useState('')
  const [reframedBelief, setReframedBelief] = useState('')

  const addAction = () => setAlignedActions(prev => [...prev, ''])
  const updateAction = (i: number, val: string) => {
    const next = [...alignedActions]
    next[i] = val
    setAlignedActions(next)
  }
  const removeAction = (i: number) => setAlignedActions(prev => prev.filter((_, idx) => idx !== i))

  const save = () => {
    if (!title.trim()) return
    const state = loadState()
    const now = new Date().toISOString()
    const vision: Vision = {
      id: genId(),
      title,
      category,
      desiredFutureState,
      whyItMatters,
      identityStatement,
      emotionalSignature,
      milestone90Day,
      firstVisibleProof,
      alignedActions: alignedActions.filter(a => a.trim()),
      possibleResistance,
      reframedBelief,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    saveState({ ...state, visions: [...state.visions, vision] })
    router.push(`/visions/${vision.id}`)
  }

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: 0, marginBottom: 8 }}>
            ← Back
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>New Vision</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>A vision is a future state you&apos;re actively becoming.</p>
        </div>

        {/* Section: The Vision */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">The Vision</div>
          <div style={{ marginBottom: 16 }}>
            <label>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Name your vision boldly" autoFocus />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as VisionCategory)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Desired future state</label>
            <textarea
              value={desiredFutureState}
              onChange={e => setDesiredFutureState(e.target.value)}
              placeholder="Describe in vivid detail what your life looks like when this vision is real..."
              rows={4}
            />
          </div>
        </div>

        {/* Section: The Why */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">The Why</div>
          <div style={{ marginBottom: 16 }}>
            <label>Why it matters</label>
            <textarea
              value={whyItMatters}
              onChange={e => setWhyItMatters(e.target.value)}
              placeholder="Why is this vision important to you? What does it make possible?"
              rows={3}
            />
          </div>
          <div>
            <label>Emotional signature</label>
            <input
              value={emotionalSignature}
              onChange={e => setEmotionalSignature(e.target.value)}
              placeholder="How do you feel when you imagine this is real? e.g. Free, proud, alive"
            />
          </div>
        </div>

        {/* Section: The Identity */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">The Identity</div>
          <div>
            <label>Identity statement</label>
            <textarea
              value={identityStatement}
              onChange={e => setIdentityStatement(e.target.value)}
              placeholder="I am someone who... (describe the identity you're stepping into)"
              rows={3}
            />
          </div>
        </div>

        {/* Section: The Path */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">The Path</div>
          <div style={{ marginBottom: 16 }}>
            <label>90-day milestone</label>
            <textarea
              value={milestone90Day}
              onChange={e => setMilestone90Day(e.target.value)}
              placeholder="What will be true in 90 days if you're on track?"
              rows={2}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>First visible proof</label>
            <input
              value={firstVisibleProof}
              onChange={e => setFirstVisibleProof(e.target.value)}
              placeholder="What's the first small sign this is working?"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Aligned actions</label>
            {alignedActions.map((action, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={action}
                  onChange={e => updateAction(i, e.target.value)}
                  placeholder={`Action ${i + 1}`}
                />
                {alignedActions.length > 1 && (
                  <button
                    onClick={() => removeAction(i)}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="btn-ghost" onClick={addAction} style={{ marginTop: 4, width: 'auto' }}>+ Add action</button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Possible resistance</label>
            <textarea
              value={possibleResistance}
              onChange={e => setPossibleResistance(e.target.value)}
              placeholder="What internal or external obstacles might show up?"
              rows={2}
            />
          </div>
          <div>
            <label>Reframed belief</label>
            <textarea
              value={reframedBelief}
              onChange={e => setReframedBelief(e.target.value)}
              placeholder="What more empowering belief supports this vision?"
              rows={2}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={save}
          disabled={!title.trim()}
          style={{ opacity: title.trim() ? 1 : 0.5 }}
        >
          Save vision ✦
        </button>
      </div>
    </div>
  )
}
