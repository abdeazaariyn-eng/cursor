import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  name: string
  color?: string
  offerId: 'one_piece' | 'two_pieces' | 'three_pieces' | 'upsell_9kwd'
  quantity: number
  unitLabel: string
  priceKwd: number
  originalPriceKwd?: number
  image: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, offerId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getSavings: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.offerId !== 'upsell_9kwd',
          )
          if (item.offerId === 'upsell_9kwd') {
            const hasUpsell = state.items.some((i) => i.offerId === 'upsell_9kwd')
            if (hasUpsell) return state
            return { items: [...state.items, item] }
          }
          if (existingIndex >= 0) {
            const newItems = [...state.items]
            newItems[existingIndex] = item
            return { items: newItems }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId, offerId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.offerId === offerId),
          ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.priceKwd, 0),
      getSavings: () =>
        get().items.reduce((sum, item) => {
          if (item.originalPriceKwd && item.originalPriceKwd > item.priceKwd) {
            return sum + (item.originalPriceKwd - item.priceKwd)
          }
          return sum
        }, 0),
    }),
    { name: 'mahdbaby-cart' },
  ),
)
