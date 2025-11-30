"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: Omit<Product, "id">) => void
}

interface FormErrors {
  [key: string]: string
}

const CATEGORIES = ["Electronics", "Accessories", "Clothing", "Home", "Sports", "Books", "Other"]

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    quantity: "",
    image: "",
    description: "",
    specification: "",
    rating: "4",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0"
    if (!formData.quantity || Number.parseInt(formData.quantity) < 0)
      newErrors.quantity = "Quantity must be 0 or greater"
    if (!formData.image.trim()) newErrors.image = "Product image URL is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.specification.trim()) newErrors.specification = "Specification is required"
    if (!formData.rating || Number.parseFloat(formData.rating) < 0 || Number.parseFloat(formData.rating) > 5) {
      newErrors.rating = "Rating must be between 0 and 5"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      onAddProduct({
        name: formData.name,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
        image: formData.image,
        description: formData.description,
        specification: formData.specification,
        rating: Number.parseFloat(formData.rating),
      })

      setFormData({
        name: "",
        category: "Electronics",
        price: "",
        quantity: "",
        image: "",
        description: "",
        specification: "",
        rating: "4",
      })
      setErrors({})
      setIsSubmitting(false)
    }, 300)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Add New Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-destructive" : "border-border"
              } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.category ? "border-destructive" : "border-border"
              } bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.price ? "border-destructive" : "border-border"
                } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.quantity ? "border-destructive" : "border-border"
                } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Product Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.image ? "border-destructive" : "border-border"
              } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? "border-destructive" : "border-border"
              } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none`}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          {/* Specification */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Specification *</label>
            <textarea
              name="specification"
              value={formData.specification}
              onChange={handleChange}
              placeholder="Enter product specifications"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.specification ? "border-destructive" : "border-border"
              } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none`}
            />
            {errors.specification && <p className="text-xs text-destructive mt-1">{errors.specification}</p>}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rating (0-5) *</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="4"
              step="0.1"
              min="0"
              max="5"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.rating ? "border-destructive" : "border-border"
              } bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.rating && <p className="text-xs text-destructive mt-1">{errors.rating}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
