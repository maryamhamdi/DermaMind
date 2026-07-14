"use client";

import { motion } from "framer-motion";

export default function Pharmacy() {
  return (
    <section className="bg-[#D5D5D6] dark:bg-[#1a1c24] py-16 sm:py-20 overflow-hidden transition-colors duration-300">

      <div className="container mx-auto px-6 sm:px-10 lg:px-15 flex flex-col lg:flex-row items-center justify-around gap-12 lg:gap-10">

        {/* LEFT CONTENT */}
        <motion.div
          className="w-full max-w-xl lg:pl-15 text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-light text-[#733608] dark:text-[#d99a5b] mb-6 leading-tight">
            Pharmacy Information
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
            Location-based pharmacy access allows users to easily find nearby
            pharmacies offering recommended products and professional consultation.
          </p>
        </motion.div>

        {/* RIGHT MAP */}
        <motion.div
          className="w-full max-w-[520px] flex justify-center lg:justify-end ml-0 xl:-mr-[7.5rem] lg:-mr-10"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
            className="rounded-2xl
w-full
rounded-xl w-[432px] h-[432px] 
sm:max-w-[420px]
lg:w-[480px]
xl:w-[445px]
h-[320px]
sm:h-[420px]
lg:h-[480px]
grayscale-0 dark:brightness-90 dark:contrast-[1.1]"
            style={{ border: 0 }}
            loading="lazy"
          />
        </motion.div>

      </div>

    </section>
  );
}