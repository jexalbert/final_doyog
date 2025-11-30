export interface Product {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
  description: string
  specification: string
  rating: number
}

export interface CartItem extends Product {
  cartQuantity: number
}
