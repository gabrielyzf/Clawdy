'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { loadState, saveState } from '../../storage'
import { AppState, Vision } from '../../types'
import Navigation from '../../components/Navigation'

const categoryColors: Record<string, string> = {
  Career: '#E8EEF5', Wealth: '#E8F5EE', Health: '#F5EEE8',
  Relationship: '#F5E8EE', Creativity: '#EEE8F5', Lifestyle: '#F5F5E8',
  Spirituality: '#EDE8F5', Other: '#F0F0F0',
}

export default function VisionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [state, setState] = useState<AppState | null>(null)
  const [vision, setVision] = useState<Vision | null>(null)

  useEffect(() => {
    const s = loadState()
    setState(s)
    const v = s.visions.find(v => v.id === id)
    if (!v) { router.replace('/visions'); return }
    setVision(v)
  }, [id, router])

  const toggleActive = () => {
    if (!state || !vision) return
    const updated = { ...vision, isActive: !vision.isActive, updatedAt: new Date().toISOString() }
    const newState = { ...state, visions: state.visions.map(v => v.id === id ? updated : v) }
    saveState(newState)
    setState(newState)
    setVision(updated)
  }

  const deleteVision = () => {
    if (!state || !confirm('Delete this vision?')) return
    const newState = { ...state, visions: state.visions.filter(v => v.id !== id) }
    saveState(newState)
    router.replace('/visions')
  }

  if (!state || !vision) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const relatedEvidence = state.evidence.filter(e => e.relatedVisionId === id)
  const relatedOpps = state.opportunities.filter(o => o.relatedVisionId === id)
  const bg = categoryColors[vision.category] || '#F5F5F5'

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: 0 }}>
            ← Back
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={toggleActive}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              {vision.isActive ? 'Mark inactive' : 'Mark active'}
            </button>
            <button onClick={deleteVision} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px', color: '#e53e3e', borderColor: '#e53e3e' }}>
              Delete
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: bg, borderRadius: 20, padding: 28, marginBottom: 16 }}>
          <span className="tag" style={{ marginBottom: 14 }}>{vision.category}</span>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>{vision.title}</h1>
          {vision.identityStatement && (
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Identity</div>
              <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.6 }}>&ldquo;{vision.identityStatement}&rdquo;</p>
            </div>
          )}
          {vision.emotionalSignature && (
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Feels like: <strong>{vision.emotionalSignature}</strong>
            </div>
          )}
        </div>

        {vision.desiredFutureState && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Desired Future State</div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>{vision.desiredFutureState}</p>
          </div>
        )}

        {vision.whyItMatters && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Why It Matters</div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{vision.whyItMatters}</p>
          </div>
        )}

        {vision.milestone90Day && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">90-Day Milestone</div>
            <p style={{ lineHeight: 1.6 }}>{vision.milestone90Day}</p>
          </div>
        )}

        {vision.firstVisibleProof && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">First Visible Proof</div>
            <p style={{ lineHeight: 1.6 }}>{vision.firstVisibleProof}</p>
          </div>
        )}

        {vision.alignedActions.length > 0 && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Aligned Actions</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {vision.alignedActions.map((a, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a1a1a', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.5 }}>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(vision.possibleResistance || vision.reframedBelief) && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Resistance → Reframe</div>
            {vision.possibleResistance && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Resistance</div>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{vision.possibleResistance}</p>
              </div>
            )}
            {vision.reframedBelief && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Reframe</div>
                <p style={{ fontSize: 14, lineHeight: 1.5, fontStyle: 'italic' }}>{vision.reframedBelief}</p>
              </div>
            )}
          </div>
        )}

        {/* Related evidence */}
        {relatedEvidence.length > 0 && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Related Evidence ({relatedEvidence.length})</div>
            {relatedEvidence.slice(0, 3).map(e => (
              <div key={e.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="tag" style={{ fontSize: 11 }}>{e.evidenceType}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.date}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.4 }}>{e.whatHappened}</p>
              </div>
            ))}
            {relatedEvidence.length > 3 && (
              <Link href="/evidence" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                View all {relatedEvidence.length} →
              </Link>
            )}
          </div>
        )}

        {/* Related opps */}
        {relatedOpps.length > 0 && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Related Opportunities ({relatedOpps.length})</div>
            {relatedOpps.slice(0, 2).map(o => (
              <div key={o.id} style={{ marginBottom: 8, fontSize: 14 }}>
                <strong>{o.idea}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{o.tinyTest}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
