export function generateFutureSelfResponse(input: string): {
  overcomplicating: string
  trusted: string
  action: string
  identity: string
} {
  const lower = input.toLowerCase()
  const isCareer = lower.includes('career') || lower.includes('job') || lower.includes('work') || lower.includes('business')
  const isRelationship = lower.includes('relation') || lower.includes('partner') || lower.includes('love') || lower.includes('friend')
  const isFinancial = lower.includes('money') || lower.includes('financial') || lower.includes('wealth') || lower.includes('income')
  const isStuck = lower.includes('stuck') || lower.includes("don't know") || lower.includes('confused') || lower.includes('lost')

  return {
    overcomplicating: isCareer
      ? "You're treating this as a strategic problem when it's actually an identity problem. You don't need a better plan — you need to start acting like the person who already has what you want."
      : isFinancial
      ? "You're waiting for certainty before taking action, but certainty comes after action, not before. The financial clarity you're seeking will emerge from moving, not from more planning."
      : isRelationship
      ? "You're trying to solve a connection problem with logic. What you're really navigating is how much of yourself you're willing to be visible."
      : isStuck
      ? "You already know the next step. You're not stuck — you're afraid of what moving forward would require you to let go of."
      : "The complexity you're experiencing is a sign you're attached to the outcome. Simplify: what's the one thing that matters most right now?",

    trusted: isCareer
      ? "You'd realize your skills are already rare enough. The people who succeed don't have more talent — they have more commitment to being seen."
      : isFinancial
      ? "You'd know that wealth is built through repeated, boring, consistent action — not through finding the perfect opportunity. The opportunity you need is already in front of you."
      : isRelationship
      ? "You'd stop trying to earn your place and start showing up as someone who already belongs. The right connections recognize you — you don't convince them."
      : isStuck
      ? "You'd trust that movement itself creates clarity. The path becomes clear by walking it, not by studying the map."
      : "You'd trust that your instincts are ahead of your analysis. The next right move is the one that feels expansive, not the one that feels safe.",

    action: isCareer
      ? "Reach out to one person this week who is doing the work you want to be doing. Not to ask for anything — just to learn and connect."
      : isFinancial
      ? "Identify one thing you could offer that creates value for someone today. Make it specific, make it small, and actually do it."
      : isRelationship
      ? "Have one honest conversation you've been avoiding. Say the thing you're afraid to say. That's where the real connection begins."
      : isStuck
      ? "Take the smallest possible action toward what you want — one email, one page, one conversation. Start so small it feels almost pointless. Then notice what opens up."
      : "Block two hours this week for the work that matters most to your vision. Treat it as non-negotiable. What you protect gets built.",

    identity: isCareer
      ? "Someone who builds things that matter, consistently, even without external validation — because the work itself is the reward."
      : isFinancial
      ? "Someone who creates value first and trusts that it returns. Someone who sees money as a byproduct of genuine usefulness, not the goal."
      : isRelationship
      ? "Someone who shows up fully — who doesn't ration their presence or edit themselves for approval. Your real self is your most magnetic self."
      : isStuck
      ? "Someone who uses uncertainty as a signal to move, not to pause. Someone who acts from clarity about values, even when outcomes are unclear."
      : "Someone who makes decisions from their future, not from their past. Someone who builds their life as a deliberate practice, not a series of reactions.",
  }
}
