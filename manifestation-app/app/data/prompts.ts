export const DAILY_PROMPTS = [
  "What would your future self do today that your current self keeps postponing?",
  "What belief are you being invited to release today?",
  "What single action would make your vision more inevitable?",
  "Where are you confusing effort with progress?",
  "What would you do if you already had the identity you're building?",
  "What evidence from the past week shows reality is responding?",
  "What are you overcomplicating that your future self would simplify?",
  "What's the gap between who you say you are and how you spent your time this week?",
  "What clarity are you avoiding because it would require a decision?",
  "If your vision were already real, what would feel obvious to do next?",
  "What resistance showed up today, and what is it protecting you from?",
  "What small action could you take today that compounds over five years?",
  "Who do you need to become for this vision to be inevitable?",
  "What are you tolerating that is incompatible with the future you're building?",
  "Where are you seeking permission instead of taking responsibility?",
  "What new belief would change everything if you actually lived from it?",
  "What would you build if you were certain it would work?",
  "What's one thing your future self would thank you for doing today?",
  "Where is fear disguised as practicality?",
  "What identity shift is this moment asking you to make?",
]

export function getTodayPrompt(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length]
}
