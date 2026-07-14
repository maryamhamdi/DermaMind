"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../../../assets/images/logo.png";

const MotionImage = motion(Image);

export default function Footer() {
  return (
    <footer className="relative w-full">

      {/* WAVE */}
       <motion.div
  className="absolute left-0 bottom-[0] w-full overflow-hidden"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
>
  <svg
    viewBox="0 0 1440 120"
    className="w-full h-[300px]"
    preserveAspectRatio="none"
  >
    <path
      d="
        M0,20
        C360,80
        1080,80
        1440,20
        L1440,120
        L0,120
        Z
      "
      fill="#35333099"
      className="dark:fill-[#0f1015cc]"
    />
  </svg>
</motion.div>

      {/* CONTENT */}
      <div className="bg-[#D5D5D6] dark:bg-[#1a1c24] pt-10 pb-6 transition-colors duration-300">

        <div className="flex flex-col items-center text-center">

          {/* LOGO */}
          <MotionImage
            src={logo}
            alt="DermaMind"
            className="cursor-pointer w-[7rem] z-30 "
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          />

          {/* TEXT */}
          <motion.p
            className="text-white text-sm opacity-90 z-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            © 2026 DermaMind. All rights reserved.
          </motion.p>

        </div>
      </div>
    </footer>
  );
}