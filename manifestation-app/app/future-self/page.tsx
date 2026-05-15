'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadState, saveState, genId } from '../storage'
import { AppState, FutureSelfMessage } from '../types'
import { generateFutureSelfResponse } from '../data/futureSelf'
import Navigation from '../components/Navigation'

export default function FutureSelfPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s = loadState()
    if (!s.profile?.onboardingComplete) { router.replace('/onboarding'); return }
    setState(s)
  }, [router])

  const submit = () => {
    if (!state || !input.trim()) return
    setLoading(true)
    setTimeout(() => {
      const responses = generateFutureSelfResponse(input)
      const msg: FutureSelfMessage = {
        id: genId(),
        userInput: input,
        responses,
        createdAt: new Date().toISOString(),
      }
      const newState = { ...state, futureSelfMessages: [msg, ...state.futureSelfMessages] }
      saveState(newState)
      setState(newState)
      setInput('')
      setLoading(false)
    }, 800)
  }

  if (!state) return <div className="page"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  const responseCards = [
    { key: 'overcomplicating' as const, label: 'What you\'re overcomplicating', icon: '🌀', bg: 'var(--bg-peach)' },
    { key: 'trusted' as const, label: 'What would be obvious if you trusted yourself', icon: '✨', bg: 'var(--bg-lavender)' },
    { key: 'action' as const, label: 'What to do this week', icon: '⚡', bg: 'var(--bg-blue)' },
    { key: 'identity' as const, label: 'Who you\'re being invited to become', icon: '🌱', bg: 'var(--bg-warm)' },
  ]

  return (
    <div className="main-with-sidebar">
      <Navigation />
      <div className="page">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Future Self</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ask the version of you who already has what you want.</p>
        </div>

        {/* Input */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <label>Your question or challenge</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="What are you struggling with? What decision do you need to make? What feels unclear?"
              rows={4}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.metaKey) submit()
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>⌘+Enter to submit</div>
          </div>
          <button
            className="btn-primary"
            onClick={submit}
            disabled={!input.trim() || loading}
            style={{ opacity: input.trim() && !loading ? 1 : 0.5 }}
          >
            {loading ? 'Thinking...' : 'Ask your future self →'}
          </button>
        </div>

        {/* History */}
        {state.futureSelfMessages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔮</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your future self has already solved the problems you&apos;re facing now.<br />
              Ask them anything.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {state.futureSelfMessages.map(msg => (
              <div key={msg.id}>
                {/* User question */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <div style={{
                    background: '#1a1a1a', color: 'white',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '12px 16px',
                    maxWidth: '80%',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.userInput}
                  </div>
                </div>
                {/* Response cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {responseCards.map(card => (
                    <div key={card.key} style={{ background: card.bg, borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span>{card.icon}</span>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                          {card.label}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        {msg.responses[card.key]}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 8 }}>
                  {msg.createdAt.split('T')[0]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
