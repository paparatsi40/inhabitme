'use client'

import { useEffect, useRef, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseBrowserClientWithRealtime } from './client'

export interface UseSupabaseSubscriptionOptions {
  channelName: string
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
  schema?: string
  table?: string
  filter?: string
  onPayload: (payload: unknown) => void
  onError?: (error: Error) => void
}

/**
 * Hook seguro para suscripciones realtime de Supabase.
 * Maneja automáticamente el estado de la conexión WebSocket
 * para evitar errores "WebSocket is already in CLOSING or CLOSED state".
 */
export function useSupabaseSubscription({
  channelName,
  event = '*',
  schema = 'public',
  table,
  filter,
  onPayload,
  onError,
}: UseSupabaseSubscriptionOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const isCleaningUp = useRef(false)

  const cleanup = useCallback(async () => {
    if (isCleaningUp.current || !channelRef.current) return
    
    isCleaningUp.current = true
    
    try {
      const channel = channelRef.current

      // Intentar unsubscribe; si el canal ya está cerrándose/cerrado, se maneja en catch
      await channel.unsubscribe()

      // Remover el canal del cliente
      const supabase = getSupabaseBrowserClientWithRealtime()
      supabase.removeChannel(channel)
    } catch (error) {
      // Silenciar errores de cleanup - la conexión ya está cerrada
      if (process.env.NODE_ENV === 'development') {
        console.log('[SupabaseSubscription] Cleanup error (expected):', error)
      }
    } finally {
      channelRef.current = null
      isCleaningUp.current = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const setupSubscription = async () => {
      try {
        const supabase = getSupabaseBrowserClientWithRealtime()
        
        let channel = supabase.channel(channelName)
        
        // Configurar el listener para cambios en PostgreSQL
        const config: Record<string, string> = { event, schema }
        if (table) config.table = table
        if (filter) config.filter = filter
        
        channel = (channel as any).on(
          'postgres_changes',
          config,
          (payload: unknown) => {
            if (isActive) {
              onPayload(payload)
            }
          }
        )
        
        channelRef.current = channel
        
        // Suscribirse con timeout para evitar bloqueos
        const timeoutId = setTimeout(() => {
          if (channelRef.current) {
            console.warn('[SupabaseSubscription] Connection timeout, cleaning up')
            cleanup()
          }
        }, 10000)
        
        const status = await channel.subscribe()
        clearTimeout(timeoutId)
        
        if (status === 'CHANNEL_ERROR' && isActive && onError) {
          onError(new Error('Failed to subscribe to channel'))
        }
      } catch (error) {
        if (isActive && onError) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    }

    setupSubscription()

    // Cleanup seguro al desmontar
    return () => {
      isActive = false
      cleanup()
    }
  }, [channelName, event, schema, table, filter, onPayload, onError, cleanup])

  // Exponer método manual de unsubscribe para casos especiales
  return {
    unsubscribe: cleanup,
    getState: () => channelRef.current?.state ?? 'closed',
  }
}
