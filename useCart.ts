// ============================================
// Cart Hook — Local state with localStorage persistence per table
// ============================================
import { useState, useEffect, useCallback } from 'react'
import type { CartItem, CartExtra } from '@/types'

function getStorageKey(restaurantId: string, tableNumber: number): string {
  return `bahri_cart_${restaurantId}_${tableNumber}`
}

export function useCart(restaurantId: string, tableNumber: number) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    if (!restaurantId || !tableNumber) return
    const key = getStorageKey(restaurantId, tableNumber)
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        setItems([])
      }
    }
    setIsLoaded(true)
  }, [restaurantId, tableNumber])

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded || !restaurantId || !tableNumber) return
    const key = getStorageKey(restaurantId, tableNumber)
    localStorage.setItem(key, JSON.stringify(items))
  }, [items, isLoaded, restaurantId, tableNumber])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.menu_item_id === item.menu_item_id && 
             JSON.stringify(i.extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id))) === 
             JSON.stringify(item.extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id)))
      )
      if (existing) {
        return prev.map(i => 
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((menuItemId: string, extras: CartExtra[]) => {
    const extrasKey = JSON.stringify(extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id)))
    setItems(prev => prev.filter(
      i => !(i.menu_item_id === menuItemId && 
             JSON.stringify(i.extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id))) === extrasKey)
    ))
  }, [])

  const updateQuantity = useCallback((menuItemId: string, extras: CartExtra[], quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId, extras)
      return
    }
    const extrasKey = JSON.stringify(extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id)))
    setItems(prev => prev.map(i => 
      i.menu_item_id === menuItemId && 
      JSON.stringify(i.extras.sort((a,b) => a.extra_id.localeCompare(b.extra_id))) === extrasKey
        ? { ...i, quantity }
        : i
    ))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => {
    const extrasPrice = i.extras.reduce((eSum, e) => eSum + e.price, 0)
    return sum + (i.price + extrasPrice) * i.quantity
  }, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoaded }
}
