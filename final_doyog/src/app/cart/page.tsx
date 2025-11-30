"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import type { Product, CartItem } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

// Mock products - same as in homepage
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    quantity: 15,
    image: "/wireless-headphones.png",
    description:
      "Premium wireless headphones with active noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    specification: "Bluetooth 5.0, 30-hour battery, ANC, Foldable design, Comfort padding",
    rating: 4.5,
  },
  {
    id: "2",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
    quantity: 50,
    image: "/usb-c-cable.jpg",
    description: "Durable USB-C charging cable with fast charging support. Compatible with most modern devices.",
    specification: "2m length, 100W power delivery, Braided nylon, Fast charging",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Portable Charger",
    category: "Electronics",
    price: 34.99,
    quantity: 8,
    image: "/portable-charger-power-bank.jpg",
    description: "High-capacity portable charger with multiple ports for charging multiple devices simultaneously.",
    specification: "20000mAh, Dual USB + USB-C, LED display, Compact design",
    rating: 4.3,
  },
  {
    id: "4",
    name: "Screen Protector",
    category: "Accessories",
    price: 9.99,
    quantity: 2,
    image: "/screen-protector-tempered-glass.jpg",
    description:
      "Tempered glass screen protector for maximum protection. Easy installation with bubble-free application.",
    specification: "9H hardness, Anti-fingerprint coating, Easy installation, 2-pack",
    rating: 4.6,
  },
]

export default function CartPage() {
  const { cartItems, updateCartQuantity, clearCart } = useCart()

  const cartProducts: CartItem[] = useMemo(() => {
    return Array.from(cartItems.entries())
      .map(([productId, cartQuantity]) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === productId)
        return product ? { ...product, cartQuantity } : null
      })
      .filter((item): item is CartItem => item !== null)
  }, [cartItems])

  const subtotal = useMemo(() => {
    return cartProducts.reduce((sum, item) => sum + item.price * item.cartQuantity, 0)
  }, [cartProducts])

  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      updateCartQuantity(productId, 0)
      return
    }

    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    if (product && newQuantity <= product.quantity) {
      updateCartQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    updateCartQuantity(productId, 0)
  }

  if (cartProducts.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to get started!</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">{cartProducts.length} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-6 flex gap-4 hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-primary font-semibold mt-1">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-background rounded-lg w-fit p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.cartQuantity - 1)}
                        className="p-1 hover:bg-muted rounded transition-colors text-foreground"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">{item.cartQuantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.cartQuantity + 1)}
                        disabled={item.cartQuantity >= item.quantity}
                        className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex flex-col items-end justify-center text-right">
                  <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                  <p className="text-2xl font-bold text-primary">${(item.price * item.cartQuantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-foreground">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Product Count */}
              <div className="mb-6 p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">
                  {Array.from(cartItems.values()).reduce((sum, qty) => sum + qty, 0)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 font-semibold">
                  Proceed to Checkout
                </Button>
                <Button onClick={clearCart} variant="outline" className="w-full bg-transparent">
                  Clear Cart
                </Button>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
