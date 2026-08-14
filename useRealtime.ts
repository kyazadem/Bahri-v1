// ============================================
// Generic Realtime Hook — Subscribes to Supabase changes
// ============================================
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeOptions<T> {
  table: string
  filter?: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void
}

export function useRealtime<T>({ table, filter, event = '*', onChange }: UseRealtimeOptions<T>) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const channelName = `${table}-${Math.random().toString(36).slice(2, 8)}`
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event,
        schema: 'public',
        table,
        filter,
      }, (payload) => {
        onChangeRef.current(payload as RealtimePostgresChangesPayload<T>)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table, filter, event])
}
