"use server"

import axios from "axios"
import { cookies } from "next/headers"

const BASE_URL = "https://dermamind-api-production-a383.up.railway.app"

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  return {
    Authorization: `Bearer ${token}`,
  }
}

export interface CartProduct {
  id: number
  name: string
  price: number
  imageUrl: string
}

export interface CartItem {
  id: number
  quantity: number
  product: CartProduct
  total: number
}

export interface CartResponse {
  cartItems: CartItem[]
  grandTotal: number
}

// GET /api/Cart
export async function getCart(): Promise<{ data: CartResponse }> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.get(`${BASE_URL}/api/Cart`, { headers })

    return { data }
  } catch (error) {
    console.error("Failed to fetch cart:", error)

    return { data: { cartItems: [], grandTotal: 0 } }
  }
}

// POST /api/Cart/add?productId=&quantity=
export async function addToCart(productId: number, quantity: number = 1) {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.post(
      `${BASE_URL}/api/Cart/add`,
      {},
      {
        headers,
        params: { productId, quantity },
      }
    )

    return { success: true, data }
  } catch (error) {
    console.error("Failed to add to cart:", error)

    return { success: false, data: null }
  }
}

// DELETE /api/Cart/remove/{cartItemId}
export async function removeFromCart(cartItemId: number) {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.delete(
      `${BASE_URL}/api/Cart/remove/${cartItemId}`,
      { headers }
    )

    return { success: true, data }
  } catch (error) {
    console.error("Failed to remove cart item:", error)

    return { success: false, data: null }
  }
}

// No PATCH endpoint exists — quantity updates are done by calling
// addToCart again with the *delta* (e.g. +1 / -1), since /add increments.
// If your backend instead OVERWRITES quantity, change `quantity` below
// to the new absolute value instead of delta.
export async function updateCartQuantity(productId: number, delta: number) {
  return addToCart(productId, delta)
}

// POST /api/Cart/checkout
export async function checkoutCart() {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.post(
      `${BASE_URL}/api/Cart/checkout`,
      {},
      { headers }
    )

    return { success: true, data }
  } catch (error) {
    console.error("Failed to checkout:", error)

    return { success: false, data: null }
  }
}