"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, ArrowLeft, Check } from "lucide-react"
import {
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "../server/wishlist.actions"
import { addToCart } from "../../cart/server/cartPage.action"
import { useAppDispatch } from "@/src/store/store"
import { setWishlistCount, decrementWishlistCount } from "../store/wishlist.slice"
import { useFlyToCart } from "../../../context/FlyToCartContext"
import { useRef } from "react"

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [addedId, setAddedId] = useState<number | null>(null)
  const dispatch = useAppDispatch()
  const { flyToTarget } = useFlyToCart()
  const cartBtnRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  const loadWishlist = async () => {
    const { data } = await getWishlist()
    setItems(data.wishlistItems)
    dispatch(setWishlistCount(data.wishlistItems.length))
  }

  useEffect(() => {
    loadWishlist().finally(() => setLoading(false))
  }, [])

  // Remove instantly from local state + Redux count, then call the API.
  // If it fails, put the item back and bump the count up again.
  const handleRemove = (wishlistItemId: number) => {
    const removedItem = items.find((i) => i.id === wishlistItemId)
    setItems((prev) => prev.filter((i) => i.id !== wishlistItemId))
    dispatch(decrementWishlistCount())

    startTransition(async () => {
      const result = await removeFromWishlist(wishlistItemId)
      if (!result.success && removedItem) {
        setItems((prev) => [...prev, removedItem])
        dispatch(setWishlistCount(items.length))
      }
    })
  }

  const handleAddToCart = (productId: number, imageUrl: string) => {
    const btnEl = cartBtnRefs.current[productId]
    if (btnEl) {
      flyToTarget("cart", btnEl, imageUrl)
    }

    startTransition(async () => {
      const result = await addToCart(productId, 1)
      if (result.success) {
        setAddedId(productId)
        setTimeout(() => setAddedId(null), 1500)
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1c24] flex items-center justify-center text-[#5a6a7a] dark:text-gray-400 transition-colors duration-300">
        Loading wishlist...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1c24] pt-24 sm:pt-28 lg:pt-32 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full
          bg-[#e0e5ec] dark:bg-[#242732] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff]
          dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.05)]
          text-[#5a6a7a] dark:text-gray-300 text-sm font-medium hover:text-[#1687D6] dark:hover:text-[#5a9fe8] transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Back to Products
        </Link>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8 max-w mx-auto">
        <p className="text-xs text-[#8a9ab0] dark:text-gray-500 mb-3 tracking-wide font-medium uppercase">
          My Wishlist &nbsp;·&nbsp; {items.length} items
        </p>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#e0e5ec] dark:bg-[#242732] rounded-2xl shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
              dark:shadow-[5px_5px_12px_rgba(0,0,0,0.4),-5px_-5px_12px_rgba(255,255,255,0.05)]
              p-3 sm:p-3.5 flex items-center gap-3"
            >
              {/* Image */}
              <div className="bg-[#e0e5ec] dark:bg-[#1a1c24] rounded-xl shadow-[inset_3px_3px_8px_#b8bec7,inset_-3px_-3px_8px_#ffffff]
              dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4),inset_-3px_-3px_8px_rgba(255,255,255,0.03)]
              w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[#2d3a4a] dark:text-gray-100 truncate">
                  {item.product.name}
                </p>
                <p className="text-[13px] sm:text-sm font-medium text-[#1687D6] dark:text-[#5a9fe8]">
                  {item.product.price.toLocaleString()} EGP
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  ref={(el) => {
                    cartBtnRefs.current[item.product.id] = el
                  }}
                  onClick={() => handleAddToCart(item.product.id, item.product.imageUrl)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium
                  shadow-[3px_3px_8px_#b8bec7,-3px_-3px_8px_#ffffff]
                  dark:shadow-[3px_3px_8px_rgba(0,0,0,0.4),-3px_-3px_8px_rgba(255,255,255,0.05)]
                  ${addedId === item.product.id ? "bg-[#0fa86e] dark:bg-[#0d8a5c] text-white" : "bg-[#1687D6] dark:bg-[#1483DA] text-white"}`}
                >
                  {addedId === item.product.id ? (
                    <>
                      <Check size={12} /> <span className="hidden sm:inline">Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={12} /> <span className="hidden sm:inline">Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove from wishlist"
                  className="bg-[#e0e5ec] dark:bg-[#1a1c24] rounded-full shadow-[inset_2px_2px_5px_#b8bec7,inset_-2px_-2px_5px_#ffffff]
                  dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.03)]
                  w-7 h-7 sm:w-8 sm:h-8 border-none cursor-pointer flex items-center justify-center text-[#e24b4a] dark:text-red-400 flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="bg-[#e0e5ec] dark:bg-[#242732] rounded-2xl shadow-[inset_4px_4px_10px_#b8bec7,inset_-4px_-4px_10px_#ffffff]
            dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.03)]
            p-10 flex flex-col items-center gap-4 text-center text-[#8a9ab0] dark:text-gray-500 text-sm">
              <Heart size={28} className="text-[#e24b4a]/40 dark:text-red-400/40" />
              <span>Your wishlist is empty</span>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                bg-[#1687D6] dark:bg-[#1483DA] text-white text-sm font-medium
                shadow-[4px_4px_12px_#a0c4e8,-2px_-2px_8px_#1a99f0]
                dark:shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.05)]"
              >
                <ArrowLeft size={14} />
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}