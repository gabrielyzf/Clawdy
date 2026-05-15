'use client'
import { AppState, DailyRitual, Evidence } from './types'

const KEY = 'manifest_v2'

export const defaultState: AppState = {
  visions: [],
  rituals: [],
  beliefs: [],
  evidence: [],
  opportunities: [],
  futureSelfMessages: [],
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch { return defaultState }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function getTodayRitual(rituals: DailyRitual[]): DailyRitual | undefined {
  return rituals.find(r => r.date === todayStr())
}

export function getEvidenceStreak(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0
  const dates = [...new Set(evidence.map(e => e.date))].sort().reverse()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i])
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
    if (diff === i) streak++
    else break
  }
  return streak
}

export function getManifestationScore(state: AppState): number {
  let score = 0
  const activeVisions = state.visions.filter(v => v.isActive)
  if (activeVisions.length > 0) {
    const clarityScore = activeVisions.reduce((sum, v) => {
      let c = 0
      if (v.desiredFutureState) c += 15
      if (v.identityStatement) c += 15
      if (v.milestone90Day) c += 10
      if (v.firstVisibleProof) c += 10
      return sum + c
    }, 0) / activeVisions.length
    score += Math.min(clarityScore, 30)
  }
  score += Math.min(state.beliefs.length * 10, 20)
  const recentRituals = state.rituals.filter(r => {
    const d = new Date(r.date)
    const now = new Date()
    return (now.getTime() - d.getTime()) / 86400000 <= 7
  })
  score += Math.min(recentRituals.length * 5, 25)
  score += Math.min(state.evidence.length * 3, 25)
  return Math.min(Math.round(score), 100)
}
