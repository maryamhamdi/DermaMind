"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { addToCart } from "../../cart/server/cartPage.action";
import { addToWishlist } from "../../wishlist/server/wishlist.actions";
export default function Products({
  products = [],
}: {
  products?: any[];
}) {
  const handleAddToCart = async (id: number) => {
  await addToCart(id, 1);
};
const handleWishlist = async (id: number) => {
  await addToWishlist(id);
};
  return (
    <section className="bg-[#E6E6E6] dark:bg-[#20222c] py-16 sm:py-20 lg:py-24 overflow-hidden transition-colors duration-300">

      {/* TITLE */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-light text-[#733608] dark:text-[#d99a5b] text-center mb-12 sm:mb-16 lg:mb-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Our Products
      </motion.h1>

      {/* PRODUCTS */}
      <motion.div
        className="flex justify-center gap-20 flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.25 },
          },
        }}
      >

        {products.slice(0, 3).map((product) => (
          <motion.div
            key={product.id}
            className="bg-[#E6E6E6] dark:bg-[#20222c] relative
w-full max-w-[320px] sm:w-[300px]
min-h-[330px]
rounded-[30px]
shadow-[inset_5px_5px_10px_#161b1d3d,inset_-5px_-5px_10px_#FAFBFF]
dark:shadow-[inset_5px_5px_10px_#0d0e12,inset_-5px_-5px_10px_#2c2f3d]
flex flex-col items-center justify-between p-5 sm:p-6"
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{ y: -8, scale: 1.03 }}
          >

  {/* HEART */}
  <button className="absolute top-4 right-4 w-10 h-10 sm:w-11 sm:h-11 md:w-[45px] md:h-[45px]
                                            rounded-full flex items-center justify-center
                                            text-[#1687D6] text-lg
                                            shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),2px_2px_8px_rgba(0,0,0,0.3)]
                                            dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),-2px_-2px_12px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.2),2px_2px_8px_rgba(0,0,0,0.5)]
                                            hover:scale-110
                                            hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            transition cursor-pointer">
    <FontAwesomeIcon
                        icon={faHeart}
                        className="text-xl transition-colors "
                      />
  </button>

            {/* IMAGE */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={140}
              height={140}
              className="object-contain mix-blend-multiply dark:mix-blend-normal h-28 sm:h-32 md:h-36 w-auto"
            />

            {/* TEXT */}
            <div className="text-center">
              <h3 className="text-[#733608] dark:text-[#d99a5b] font-medium text-base sm:text-lg leading-relaxed">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">{product.price}</p>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="self-end"
            >
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="text-3xl text-[#1482da] dark:text-[#5a9fe8]"
              />
            </motion.button>

          </motion.div>
        ))}

      </motion.div>
    </section>
  );
}