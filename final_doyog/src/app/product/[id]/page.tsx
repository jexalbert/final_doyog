"use client"

import { useState, useMemo, use } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"

// Mock products - in a real app, this would come from a database
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [cartQuantity, setCartQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = useMemo(() => {
    return MOCK_PRODUCTS.find((p) => p.id === id)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Go to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isLowStock = product.quantity < 5
  const subtotal = product.price * cartQuantity

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Product Detail */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden h-96 md:h-full">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isLowStock && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
                    Low Stock - {product.quantity} left
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category and Rating */}
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase bg-background px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-muted"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">({product.rating})</span>
                  </div>
                </div>

                {/* Title and Price */}
                <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground">per unit</span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-2 uppercase">Description</h3>
                  <p className="text-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Specification */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-2 uppercase">Specifications</h3>
                  <div className="bg-background rounded-lg p-4 text-foreground space-y-2">
                    {product.specification.split(", ").map((spec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-border pt-6">
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground block mb-3">Quantity</label>
                  <div className="flex items-center gap-2 bg-background rounded-lg w-fit p-1">
                    <button
                      onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                      disabled={cartQuantity === 1}
                      className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={cartQuantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value) || 1
                        setCartQuantity(Math.max(1, Math.min(val, product.quantity)))
                      }}
                      min="1"
                      max={product.quantity}
                      className="w-12 text-center bg-transparent text-foreground font-semibold focus:outline-none"
                    />
                    <button
                      onClick={() => setCartQuantity(Math.min(product.quantity, cartQuantity + 1))}
                      disabled={cartQuantity >= product.quantity}
                      className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Display */}
                <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                  <p className="text-3xl font-bold text-primary">${subtotal.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {cartQuantity} × ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className={`w-full py-6 text-lg gap-2 font-semibold transition-all ${
                    addedToCart
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedToCart ? "Added to Cart!" : `Add to Cart (${cartQuantity})`}
                </Button>

                {product.quantity === 0 && (
                  <p className="text-center text-destructive font-medium mt-4">Out of Stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
