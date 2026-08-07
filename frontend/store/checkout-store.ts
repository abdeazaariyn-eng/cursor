import { create } from 'zustand'

export interface UpsellProductData {
  productId: string
  productName: string
  priceKwd: number
  image: string
}

interface CheckoutStore {
  isCheckoutOpen: boolean
  pendingOrderId: string | null
  pendingOrderNumber: string | null
  pendingOrderTotal: number
  customerPhone: string | null
  isUpsellShown: boolean
  upsellProduct: UpsellProductData | null
  openCheckout: () => void
  closeCheckout: () => void
  setPendingOrder: (
    id: string,
    orderNumber: string,
    totalKwd: number,
    upsellData: UpsellProductData | null,
    phone?: string,
  ) => void
  showUpsell: () => void
  hideUpsell: () => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  isCheckoutOpen: false,
  pendingOrderId: null,
  pendingOrderNumber: null,
  pendingOrderTotal: 0,
  customerPhone: null,
  isUpsellShown: false,
  upsellProduct: null,
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  setPendingOrder: (id, orderNumber, totalKwd, upsellData, phone) =>
    set({
      pendingOrderId: id,
      pendingOrderNumber: orderNumber,
      pendingOrderTotal: totalKwd,
      customerPhone: phone ?? null,
      upsellProduct: upsellData,
    }),
  showUpsell: () => set({ isUpsellShown: true, isCheckoutOpen: false }),
  hideUpsell: () => set({ isUpsellShown: false }),
  reset: () =>
    set({
      isCheckoutOpen: false,
      pendingOrderId: null,
      pendingOrderNumber: null,
      pendingOrderTotal: 0,
      customerPhone: null,
      isUpsellShown: false,
      upsellProduct: null,
    }),
}))
