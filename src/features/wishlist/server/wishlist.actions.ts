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

export interface WishlistProduct {
  id: number
  name: string
  brand: string
  description: string
  price: number
  imageUrl: string
  category: string
  createdAt: string
}

export interface WishlistItem {
  id: number
  addedAt: string
  product: WishlistProduct
}

export interface WishlistResponse {
  wishlistItems: WishlistItem[]
}

// GET /api/Wishlist  -> returns a raw array, not { wishlistItems, ... }
export async function getWishlist(): Promise<{ data: WishlistResponse }> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.get<WishlistItem[]>(
      `${BASE_URL}/api/Wishlist`,
      { headers }
    )

    return { data: { wishlistItems: data } }
  } catch (error) {
    console.error("Failed to fetch wishlist:", error)

    return { data: { wishlistItems: [] } }
  }
}

// POST /api/Wishlist/add/{productId}
export async function addToWishlist(productId: number) {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.post(
      `${BASE_URL}/api/Wishlist/add/${productId}`,
      {},
      { headers }
    )

    return { success: true, data }
  } catch (error) {
    console.error("Failed to add to wishlist:", error)

    return { success: false, data: null }
  }
}

// DELETE /api/Wishlist/remove/{wishlistItemId}
export async function removeFromWishlist(wishlistItemId: number) {
  try {
    const headers = await getAuthHeaders()
    const { data } = await axios.delete(
      `${BASE_URL}/api/Wishlist/remove/${wishlistItemId}`,
      { headers }
    )

    return { success: true, data }
  } catch (error) {
    console.error("Failed to remove wishlist item:", error)

    return { success: false, data: null }
  }
}