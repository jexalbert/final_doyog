"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import type { Product, CartItem } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  products: Product[]
  onClearCart: () => void
}

export default function Header({ products, onClearCart }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const { cartItems } = useCart()

  const cartProducts: CartItem[] = Array.from(cartItems.entries()).map(([productId, cartQuantity]) => {
    const product = products.find((p) => p.id === productId)
    return {
      ...product!,
      cartQuantity,
    }
  })

  const cartTotal = cartProducts.reduce((sum, item) => sum + item.price * item.cartQuantity, 0)
  const cartItemCount = Array.from(cartItems.values()).reduce((sum, qty) => sum + qty, 0)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">PM</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">Product Manager</span>
          </Link>

          {/* Cart Icon */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Shopping Cart</h3>

                {cartProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto space-y-2 mb-4">
                      {cartProducts.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.cartQuantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold text-foreground">
                            ${(item.price * item.cartQuantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-foreground">Total:</span>
                        <span className="text-xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href="/cart"
                          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-medium text-sm"
                          onClick={() => setIsCartOpen(false)}
                        >
                          View All
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            onClearCart()
                            setIsCartOpen(false)
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
