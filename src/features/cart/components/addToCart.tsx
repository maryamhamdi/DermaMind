"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { addToCart } from "../../cart/server/cartPage.action";
import { useAppDispatch } from "@/src/store/store";
import { increaseCartCount } from "../store/cart.slice";
import { useFlyToCart } from "../../../context/FlyToCartContext";

interface AddToCartButtonProps {
  productId: number;
  imageUrl: string;
}

export default function AddToCartButton({ productId, imageUrl }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const dispatch = useAppDispatch();
  const { flyToTarget } = useFlyToCart();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = async () => {
    setStatus("loading");

    // Fire the flying-image animation immediately for instant feedback,
    // then confirm with the real API call.
    if (buttonRef.current) {
      flyToTarget("cart", buttonRef.current, imageUrl);
    }

    const result = await addToCart(productId, 1);

    if (result.success) {
      dispatch(increaseCartCount());
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("idle");
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAddToCart}
      disabled={status === "loading"}
      className={`w-full py-2 rounded-xl bg-[#D9D9D9] dark:bg-[#2a2d3a]
      shadow-[6px_6px_10px_rgba(0,0,0,0.15),-6px_-6px_10px_#ffffff]
      dark:shadow-[6px_6px_10px_rgba(0,0,0,0.4),-6px_-6px_10px_rgba(255,255,255,0.05)]
      flex items-center justify-center gap-2
      hover:shadow-inner transition
      ${status === "added" ? "text-green-700 dark:text-green-400" : "text-[#6B3F16] dark:text-[#d99a5b]"}`}
    >
      <FontAwesomeIcon icon={status === "added" ? faCheck : faCartShopping} />
      {status === "added"
        ? "Added!"
        : status === "loading"
        ? "Adding..."
        : "Add To Cart"}
    </motion.button>
  );
}