import { PRIORITY_CITIES } from '@/config/scoring'

type LeadScoringInput = {
  city: string
  neighborhood?: string
  startDate: string
  relocating?: boolean
  email: string
}

export type LeadScoreResult = {
  score: number
  label: 'HOT' | 'WARM' | 'COLD'
}

export function scoreLead(input: LeadScoringInput): LeadScoreResult {
  let score = 0

  // City priority
  if (PRIORITY_CITIES.includes(input.city.toLowerCase())) {
    score += 30
  }

  // Relocating
  if (input.relocating) {
    score += 25
  }

  // Stay length (>= 30 days)
  const start = new Date(input.startDate)
  const now = new Date()
  const diffDays =
    (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays >= 30) {
    score += 30
  }

  // Email domain quality
  if (!input.email.endsWith('@gmail.com') &&
      !input.email.endsWith('@hotmail.com')) {
    score += 15
  }

  // Neighborhood signal
  if (input.neighborhood) {
    score += 10
  }

  let label: LeadScoreResult['label'] = 'COLD'
  if (score >= 70) label = 'HOT'
  else if (score >= 40) label = 'WARM'

  return { score, label }
}
