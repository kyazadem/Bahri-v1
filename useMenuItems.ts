// ============================================
// Menu Items Hook — CRUD for staff/owners
// ============================================
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MenuItem, MenuItemExtra } from '@/types'

export function useMenuItems(restaurantId: string | undefined) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!restaurantId) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        extras:menu_item_extras(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('category')
      .order('sort_order')

    if (!error && data) {
      setItems(data as MenuItem[])
    }
    setIsLoading(false)
  }, [restaurantId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const createItem = useCallback(async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('menu_items').insert(item).select().single()
    if (!error && data) {
      setItems(prev => [...prev, data as MenuItem])
      return data as MenuItem
    }
    return null
  }, [])

  const updateItem = useCallback(async (id: string, updates: Partial<MenuItem>) => {
    const { data, error } = await supabase.from('menu_items').update(updates).eq('id', id).select().single()
    if (!error && data) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } as MenuItem : i))
      return true
    }
    return false
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) {
      setItems(prev => prev.filter(i => i.id !== id))
      return true
    }
    return false
  }, [])

  const toggleAvailability = useCallback(async (id: string, available: boolean) => {
    return updateItem(id, { available })
  }, [updateItem])

  return { items, isLoading, refresh: fetchItems, createItem, updateItem, deleteItem, toggleAvailability }
}
