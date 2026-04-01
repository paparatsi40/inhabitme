'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Message = {
  id: string
  sender_role: string
  body: string
  created_at: string
}

type Props = {
  conversationId: string
  locale: string
  title: string
  placeholder: string
}

export function ConversationPanel({ conversationId, locale, title, placeholder }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [text, setText] = useState('')

  const dateLocale = useMemo(() => (locale === 'en' ? 'en-US' : 'es-ES'), [locale])

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const id = setInterval(fetchMessages, 6000)
    return () => clearInterval(id)
  }, [conversationId])

  async function sendMessage() {
    const body = text.trim()
    if (body.length < 2 || sending) return

    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })

      if (!res.ok) return
      setText('')
      await fetchMessages()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 mb-3">{title}</h2>

      <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg text-sm ${msg.sender_role === 'host' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'}`}
            >
              <div className="font-semibold text-xs uppercase mb-1">{msg.sender_role}</div>
              <div>{msg.body}</div>
              <div className="text-[10px] opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleString(dateLocale)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <Button onClick={sendMessage} disabled={sending || text.trim().length < 2}>
          {sending ? '...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
