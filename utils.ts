// ============================================
// Utility Functions
// ============================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    starters: '🥗',
    mains: '🍽️',
    drinks: '🍹',
    desserts: '🍰',
    seafood: '🦐',
    grill: '🔥',
    salad: '🥬',
    soup: '🍲',
  }
  return map[category.toLowerCase()] || '🍴'
}

export function generateQrUrl(restaurantSlug: string, tableNumber: number, baseUrl: string): string {
  return `${baseUrl}/?restaurant=${restaurantSlug}&table=${tableNumber}`
}
