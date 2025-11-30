"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartContextType {
  cartItems: Map<string, number>
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map())

  const addToCart = (productId: string) => {
    setCartItems((prev) => {
      const newCart = new Map(prev)
      newCart.set(productId, (newCart.get(productId) || 0) + 1)
      return newCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newCart = new Map(prev)
      const currentQty = newCart.get(productId) || 0
      if (currentQty <= 1) {
        newCart.delete(productId)
      } else {
        newCart.set(productId, currentQty - 1)
      }
      return newCart
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const newCart = new Map(prev)
      if (quantity <= 0) {
        newCart.delete(productId)
      } else {
        newCart.set(productId, quantity)
      }
      return newCart
    })
  }

  const clearCart = () => {
    setCartItems(new Map())
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
