"use client"

import { useState } from "react"
import Header from "@/components/header"
import ProductList from "@/components/product-list"
import AddProductModal from "@/components/add-product-modal"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    quantity: 15,
    image: "/wireless-headphones.png",
    description: "Premium wireless headphones with active noise cancellation",
    specification: "Bluetooth 5.0, 30-hour battery, ANC, Foldable design",
    rating: 4.5,
  },
  {
    id: "2",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
    quantity: 50,
    image: "/usb-c-cable.jpg",
    description: "Durable USB-C charging cable with fast charging support",
    specification: "2m length, 100W power delivery, Braided nylon",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Portable Charger",
    category: "Electronics",
    price: 34.99,
    quantity: 8,
    image: "/portable-charger-power-bank.jpg",
    description: "High-capacity portable charger with multiple ports",
    specification: "20000mAh, Dual USB + USB-C, LED display",
    rating: 4.3,
  },
  {
    id: "4",
    name: "Screen Protector",
    category: "Accessories",
    price: 9.99,
    quantity: 2,
    image: "/screen-protector-tempered-glass.jpg",
    description: "Tempered glass screen protector for maximum protection",
    specification: "9H hardness, Anti-fingerprint coating, Easy installation",
    rating: 4.6,
  },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const { addToCart, clearCart } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    }
    setProducts([...products, product])
    setIsModalOpen(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header products={products} onClearCart={clearCart} />
      <ProductList products={products} onAddToCart={addToCart} onAddProduct={() => setIsModalOpen(true)} />
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProduct={handleAddProduct} />
    </main>
  )
}
