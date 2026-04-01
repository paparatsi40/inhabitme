export type ConversationState =
  | 'inquiry_sent'
  | 'awaiting_host_reply'
  | 'conversation_active'
  | 'booking_requested'
  | 'booking_pending_host'
  | 'payment_pending'
  | 'confirmed'
  | 'closed'
  | 'declined'

export function normalizeConversationState(value: string | null | undefined): ConversationState {
  const v = String(value || '').trim()
  if (
    v === 'inquiry_sent' ||
    v === 'awaiting_host_reply' ||
    v === 'conversation_active' ||
    v === 'booking_requested' ||
    v === 'booking_pending_host' ||
    v === 'payment_pending' ||
    v === 'confirmed' ||
    v === 'closed' ||
    v === 'declined'
  ) {
    return v
  }
  return 'inquiry_sent'
}

export function computeIntentScore(messageCount: number, isBidirectional: boolean, currentStatus?: string | null): number {
  const countScore = Math.min(60, Math.max(0, messageCount * 8))
  const bidirectionalBonus = isBidirectional ? 20 : 0
  const statusBonus = currentStatus === 'booking_requested' ? 20 : 0
  return Math.min(100, countScore + bidirectionalBonus + statusBonus)
}
