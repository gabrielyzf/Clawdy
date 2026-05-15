export type EnergyState = 'Calm' | 'Focused' | 'Anxious' | 'Expansive' | 'Tired' | 'Grateful'
export type VisionCategory = 'Career' | 'Wealth' | 'Health' | 'Relationship' | 'Creativity' | 'Lifestyle' | 'Spirituality' | 'Other'
export type EvidenceType = 'Synchronicity' | 'Opportunity' | 'Compliment' | 'Progress' | 'Inner Shift' | 'External Result'

export interface UserProfile {
  id: string
  name: string
  lifeFocus: string
  focusAreas: VisionCategory[]
  emotionalState: EnergyState
  onboardingComplete: boolean
  createdAt: string
}

export interface Vision {
  id: string
  title: string
  category: VisionCategory
  desiredFutureState: string
  whyItMatters: string
  identityStatement: string
  emotionalSignature: string
  milestone90Day: string
  firstVisibleProof: string
  alignedActions: string[]
  possibleResistance: string
  reframedBelief: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DailyRitual {
  id: string
  date: string
  energyState: EnergyState
  topVisionId?: string
  promptUsed: string
  promptResponse: string
  committedAction: string
  gratitude: string[]
  completedAt?: string
}

export interface BeliefAudit {
  id: string
  want: string
  secretBelief: string
  beliefOrigin: string
  beliefProtects: string
  powerfulBelief: string
  proofAction: string
  createdAt: string
}

export interface Evidence {
  id: string
  date: string
  relatedVisionId?: string
  evidenceType: EvidenceType
  whatHappened: string
  whyItMatters: string
  nextAction: string
  createdAt: string
}

export interface Opportunity {
  id: string
  idea: string
  whyNow: string
  whoNeedsThis: string
  signalNoticed: string
  tinyTest: string
  potentialUpside: string
  energyLevel: number
  relatedVisionId?: string
  createdAt: string
}

export interface FutureSelfMessage {
  id: string
  userInput: string
  responses: {
    overcomplicating: string
    trusted: string
    action: string
    identity: string
  }
  createdAt: string
}

export interface AppState {
  profile?: UserProfile
  visions: Vision[]
  rituals: DailyRitual[]
  beliefs: BeliefAudit[]
  evidence: Evidence[]
  opportunities: Opportunity[]
  futureSelfMessages: FutureSelfMessage[]
}
