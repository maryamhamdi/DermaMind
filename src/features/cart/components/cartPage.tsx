"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, ShoppingBag, Lock, Trash2, Plus, Minus, Tag, ArrowLeft } from "lucide-react"
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  checkoutCart,
  type CartItem,
} from "../server/cartPage.action"
import { useAppDispatch } from "@/src/store/store"
import { setCartCount } from "@/src/features/cart/store/cart.slice"

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [promo, setPromo] = useState("")
  const [isPending, startTransition] = useTransition()
  const dispatch = useAppDispatch()

  const loadCart = async () => {
    const { data } = await getCart()

    setCartItems(data.cartItems)
    setGrandTotal(data.grandTotal)

    const count = data.cartItems.reduce((sum, item) => sum + item.quantity, 0) || 0
    dispatch(setCartCount(count))
  }

  useEffect(() => {
    loadCart().finally(() => setLoading(false))
  }, [])

  const handleIncrease = (productId: number) => {
    startTransition(async () => {
      await updateCartQuantity(productId, 1)
      await loadCart()
    })
  }

  const handleDecrease = (item: CartItem) => {
    startTransition(async () => {
      if (item.quantity <= 1) {
        await removeFromCart(item.id)
      } else {
        await updateCartQuantity(item.product.id, -1)
      }
      await loadCart()
    })
  }

  const handleRemove = (cartItemId: number) => {
    startTransition(async () => {
      await removeFromCart(cartItemId)
      await loadCart()
    })
  }

  const handleCheckout = () => {
    startTransition(async () => {
      const result = await checkoutCart()

      if (result.success && result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1c24] flex items-center justify-center text-[#5a6a7a] dark:text-gray-400 transition-colors duration-300">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Loading cart...
        </motion.span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1c24] pt-24 sm:pt-28 lg:pt-32 transition-colors duration-300"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
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
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 px-4 sm:px-6 lg:px-8 pb-8">

        {/* Left — Cart Items */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-[#8a9ab0] dark:text-gray-500 mb-3 tracking-wide font-medium uppercase"
          >
            Shopping Cart &nbsp;·&nbsp; {cartItems.length} items
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="flex flex-col gap-4"
          >
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                  layout
                  className="bg-[#e0e5ec] dark:bg-[#242732] rounded-[20px] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff]
                  dark:shadow-[6px_6px_14px_rgba(0,0,0,0.4),-6px_-6px_14px_rgba(255,255,255,0.05)]
                  p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Image + Info row on mobile */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-[#e0e5ec] dark:bg-[#1a1c24] rounded-2xl shadow-[inset_4px_4px_10px_#b8bec7,inset_-4px_-4px_10px_#ffffff]
                    dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.03)]
                    w-16 h-16 sm:w-[68px] sm:h-[68px] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d3a4a] dark:text-gray-100 mb-1 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[15px] font-medium text-[#1687D6] dark:text-[#5a9fe8]">
                        {item.product.price.toLocaleString()} EGP{" "}
                        <span className="text-xs text-[#8a9ab0] dark:text-gray-500 font-normal">/ unit</span>
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2.5">
                    <div className="bg-[#e0e5ec] dark:bg-[#1a1c24] rounded-full shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff]
                    dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.03)]
                    flex items-center gap-2.5 px-3 py-1.5">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleDecrease(item)}
                        disabled={isPending}
                        aria-label="Decrease"
                        className="bg-[#e0e5ec] dark:bg-[#242732] rounded-full shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff]
                        dark:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.4),inset_-3px_-3px_7px_rgba(255,255,255,0.05)]
                        w-[26px] h-[26px] border-none cursor-pointer flex items-center justify-center text-[#5a6a7a] dark:text-gray-300"
                      >
                        <Minus size={13} />
                      </motion.button>

                      <AnimatePresence mode="wait">
                        <motion.span
                          key={item.quantity}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium text-[#2d3a4a] dark:text-gray-100 min-w-[18px] text-center inline-block"
                        >
                          {item.quantity}
                        </motion.span>
                      </AnimatePresence>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleIncrease(item.product.id)}
                        disabled={isPending}
                        aria-label="Increase"
                        className="bg-[#e0e5ec] dark:bg-[#242732] rounded-full shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff]
                        dark:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.4),inset_-3px_-3px_7px_rgba(255,255,255,0.05)]
                        w-[26px] h-[26px] border-none cursor-pointer flex items-center justify-center text-[#1687D6] dark:text-[#5a9fe8]"
                      >
                        <Plus size={13} />
                      </motion.button>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#8a9ab0] dark:text-gray-500 order-3 sm:order-none">
                      Total:{" "}
                      <span className="text-[#2d3a4a] dark:text-gray-100 font-medium">
                        {item.total.toLocaleString()} EGP
                      </span>
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.08 }}
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      aria-label="Remove"
                      className="bg-[#e0e5ec] dark:bg-[#242732] rounded-full shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff]
                      dark:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.4),inset_-3px_-3px_7px_rgba(255,255,255,0.05)]
                      w-8 h-8 border-none cursor-pointer flex items-center justify-center text-[#e24b4a] dark:text-red-400"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-[#e0e5ec] dark:bg-[#242732] rounded-2xl shadow-[inset_4px_4px_10px_#b8bec7,inset_-4px_-4px_10px_#ffffff]
                dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.03)]
                p-10 flex flex-col items-center gap-4 text-center text-[#8a9ab0] dark:text-gray-500 text-sm"
              >
                <span>Your cart is empty</span>
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
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right — Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-xs text-[#8a9ab0] dark:text-gray-500 mb-3 tracking-wide font-medium uppercase">
            Order Summary
          </p>

          <div className="bg-[#e0e5ec] dark:bg-[#242732] rounded-[20px] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.4),-6px_-6px_14px_rgba(255,255,255,0.05)] p-5">

            <div className="bg-[#1687D6] dark:bg-[#1483DA] rounded-2xl p-4 mb-4 flex items-center gap-2.5
            shadow-[4px_4px_12px_#a0c4e8,-2px_-2px_8px_#1a99f0] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.05)]">
              <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-white m-0">Order Summary</p>
                <p className="text-xs text-white/70 m-0">{cartItems.length} items in your cart</p>
              </div>
            </div>

            <div className="bg-[#e0e5ec] dark:bg-[#1a1c24] rounded-2xl shadow-[inset_4px_4px_10px_#b8bec7,inset_-4px_-4px_10px_#ffffff]
            dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.03)]
            p-3.5 mb-4 flex items-center gap-2.5">
              <Truck size={20} className="text-[#0fa86e] dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-[#0a7a50] dark:text-emerald-400 m-0">Free Shipping!</p>
                <p className="text-[11px] text-[#0a7a50]/70 dark:text-emerald-400/70 m-0">You qualify for free delivery</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 px-0.5 pb-5">
              <div className="flex justify-between text-[13px] text-[#8a9ab0] dark:text-gray-500">
                <span>Subtotal</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={grandTotal}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#2d3a4a] dark:text-gray-100 font-medium inline-block"
                  >
                    {grandTotal.toLocaleString()} EGP
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex justify-between text-[13px] text-[#8a9ab0] dark:text-gray-500">
                <span>Shipping</span>
                <span className="text-[#0fa86e] dark:text-emerald-400 font-medium">Free</span>
              </div>
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-1.5" />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-[#2d3a4a] dark:text-gray-100">Total</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={grandTotal}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-base font-medium text-[#2d3a4a] dark:text-gray-100 inline-block"
                  >
                    {grandTotal.toLocaleString()} EGP
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: cartItems.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: cartItems.length === 0 ? 1 : 0.97 }}
              onClick={handleCheckout}
              disabled={isPending || cartItems.length === 0}
              className={`w-full bg-[#1687D6] dark:bg-[#1483DA] text-white border-none rounded-full py-3.5 text-[15px] font-medium
              flex items-center justify-center gap-2
              shadow-[4px_4px_12px_#a0c4e8,-2px_-2px_8px_#1a99f0]
              dark:shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.05)]
              ${cartItems.length === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <Lock size={15} />
              {isPending ? "Processing..." : "Proceed to Checkout"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}