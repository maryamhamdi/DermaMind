"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import img1 from "../../../assets/images/chatbot.png";

const MotionImage = motion.create(Image);

export default function Products() {
  return (
    <section className="bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen flex flex-col justify-center py-16 lg:py-0 overflow-hidden transition-colors duration-300">

      {/* TITLE */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-light text-[#733608] dark:text-[#d99a5b] text-center mb-10 lg:mb-15 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{  duration: 0.8, ease: "easeOut"}}
        viewport={{ once: true }}
      >
        Our Chatbot
      </motion.h1>

      {/* CONTENT */}
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-15 gap-10 lg:gap-0">

        {/* LEFT TEXT */}
        <motion.div
          className="w-full max-w-xl lg:pl-20 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl mb-4 leading-relaxed">
            An AI assistant that helps you understand your skin analysis,
            answers skincare questions, and provides personalized guidance
            for sensitive and reactive skin.
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-xl mb-4">
            The chatbot does not provide medical diagnoses or prescriptions.
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
            For accurate diagnosis and treatment, users are advised to
            consult a certified dermatologist.
          </p>
        </motion.div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center w-full lg:w-1/2">
          <MotionImage
            src={img1}
            alt="Chatbot"
            width={400}
            height={400}
            className="object-contain w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

      </div>
    </section>
  );
}