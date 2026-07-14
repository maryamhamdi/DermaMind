"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"
import AddToCartButton from "../../cart/components/addToCart";
import { addToWishlist } from "../../wishlist/server/wishlist.actions";
import { useAppDispatch } from "@/src/store/store";
import { incrementWishlistCount } from "../../wishlist/store/wishlist.slice";
import { useFlyToCart } from "../../../context/FlyToCartContext";

export default function AllCategoriesScreen({
  categories,
}: {
  categories: any[];
}) {
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [pendingId, setPendingId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const { flyToTarget } = useFlyToCart();
  const heartRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -40,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleAddToWishlist = async (productId: number, imageUrl: string) => {
    if (wishlistedIds.has(productId)) return;

    setPendingId(productId);

    const heartEl = heartRefs.current[productId];
    if (heartEl) {
      flyToTarget("wishlist", heartEl, imageUrl);
    }

    const result = await addToWishlist(productId);
    setPendingId(null);

    if (result.success) {
      setWishlistedIds((prev) => new Set(prev).add(productId));
      dispatch(incrementWishlistCount());
    }
  };

  return (

    <section className="min-h-screen bg-[#D5D5D6] dark:bg-[#1a1c24] px-6 py-10 transition-colors duration-300">
      <motion.div
        className="mt-20 grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-5
        gap-6"
        variants={itemVariants}
        whileHover={{
          y: -10,
          transition: {
            duration: 0.2,
          },
        }}
      >
        {categories.map((product) => {
          const isWishlisted = wishlistedIds.has(product.id);
          const isPending = pendingId === product.id;

          return (
            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 0 20px rgba(0,149,255,0.15)",
              }}
              key={product.id}
              className="bg-[#E6E6E6] dark:bg-[#20222c]
              rounded-[25px]
              h-[260px] md:h-[340px]
              p-3 md:p-6
              shadow-[inset_5px_5px_10px_#161b1d3d,inset_-5px_-5px_10px_#FAFBFF]
              dark:shadow-[inset_5px_5px_10px_#0d0e12,inset_-5px_-5px_10px_#2c2f3d]
              flex flex-col items-center justify-between relative
              transition-colors duration-300"
            >
              <div className="absolute top-4 right-4">
                <button
                  ref={(el) => {
                    heartRefs.current[product.id] = el;
                  }}
                  onClick={() => handleAddToWishlist(product.id, product.imageUrl)}
                  disabled={isPending}
                  aria-label="Add to wishlist"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`text-xl transition-colors ${
                      isWishlisted
                        ? "text-red-500"
                        : "text-gray-400 dark:text-gray-500 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>

              <div
                className="h-[120px] flex items-center justify-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={140}
                  height={140}
                  className="object-contain
                  mix-blend-multiply dark:mix-blend-normal
                  h-20 md:h-36"
                />
              </div>

              <h3 className="text-[#6B3F16] dark:text-[#d99a5b]
              font-medium
              text-xs md:text-base
              text-center
              line-clamp-2">
                {product.name}
              </h3>

              <p className="text-[11px]
              md:text-sm
              text-gray-600 dark:text-gray-300
              pb-2">
                {product.price} EGP
              </p>

              <AddToCartButton
                productId={product.id}
                imageUrl={product.imageUrl}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}