// ============================================
// Restaurant Context — Parses URL params, loads restaurant data
// ============================================
import { useEffect, useState, createContext, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Restaurant, TableContext } from '@/types'

interface RestaurantContextType extends TableContext {
  isLoading: boolean
  error: string | null
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurantId: '',
  tableNumber: 0,
  isLoading: true,
  error: null,
})

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Parse URL params
  const restaurantSlug = searchParams.get('restaurant') || ''
  const tableNumber = parseInt(searchParams.get('table') || '0', 10)

  useEffect(() => {
    async function loadRestaurant() {
      if (!restaurantSlug) {
        setError('No restaurant specified. Please scan a valid QR code.')
        setIsLoading(false)
        return
      }

      const { data, error: dbError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', restaurantSlug)
        .eq('is_active', true)
        .single()

      if (dbError || !data) {
        setError('Restaurant not found or inactive.')
      } else {
        setRestaurant(data as Restaurant)
      }
      setIsLoading(false)
    }

    loadRestaurant()
  }, [restaurantSlug])

  return (
    <RestaurantContext.Provider
      value={{
        restaurantId: restaurant?.id || '',
        tableNumber,
        restaurant,
        isLoading,
        error,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  return useContext(RestaurantContext)
}
