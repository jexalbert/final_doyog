"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart } from "lucide-react"

interface ProductListProps {
  products: Product[]
  onAddToCart: (productId: string) => void
  onAddProduct: () => void
}

export default function ProductList({ products, onAddToCart, onAddProduct }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return ["All", ...Array.from(cats).sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products
    }
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  const isLowStock = (quantity: number) => quantity < 5

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage and browse your product catalog</p>
          </div>
          <Button
            onClick={onAddProduct}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Button onClick={onAddProduct} variant="outline">
              Add your first product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-48 bg-muted overflow-hidden cursor-pointer group">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isLowStock(product.quantity) && (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Rating */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-muted"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                  </div>

                  {/* Price and Quantity */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    <span
                      className={`text-sm font-medium ${isLowStock(product.quantity) ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {product.quantity} in stock
                    </span>
                  </div>

                  {/* Subtotal Display */}
                  <div className="mb-4 p-3 bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Subtotal per unit</p>
                    <p className="text-lg font-semibold text-foreground">${product.price.toFixed(2)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={() => onAddToCart(product.id)}
                      disabled={product.quantity === 0}
                      className="p-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:bg-muted disabled:text-muted-foreground"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
