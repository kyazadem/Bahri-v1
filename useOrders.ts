// ============================================
// Orders Hook — Fetch + realtime updates for a restaurant
// ============================================
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRealtime } from './useRealtime'
import type { Order } from '@/types'

export function useOrders(restaurantId: string | undefined, initialStatus?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) return
    setIsLoading(true)

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          menu_item:menu_items(name, image_url)
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (initialStatus) {
      query = query.eq('status', initialStatus)
    }

    const { data, error } = await query.limit(200)

    if (!error && data) {
      setOrders(data as Order[])
    }
    setIsLoading(false)
  }, [restaurantId, initialStatus])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Subscribe to realtime changes
  useRealtime<Order>({
    table: 'orders',
    filter: restaurantId ? `restaurant_id=eq.${restaurantId}` : undefined,
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setOrders(prev => [payload.new as Order, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o))
      } else if (payload.eventType === 'DELETE') {
        setOrders(prev => prev.filter(o => o.id !== payload.old.id))
      }
    },
  })

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    return !error
  }, [])

  return { orders, isLoading, refresh: fetchOrders, updateStatus }
}
