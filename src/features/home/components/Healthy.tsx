'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import Healthy from '../../../assets/images/home1.png'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/navigation";


export default function Slider() {
  const [blurGone, setBlurGone] = useState(false)
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      setBlurGone(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#D5D5D6] dark:bg-[#1a1c24] transition-colors duration-300">

      {/* BLUR INTRO */}
      <div
        className={`
          fixed inset-0 z-50
          backdrop-blur-sm bg-white/20 dark:bg-black/30
          transition-opacity duration-1000
          ${blurGone ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      />

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        pagination={{ clickable: true }}
        loop
        className="min-h-screen"
      >
        {/* SLIDE */}
        <SwiperSlide>
          <div className="mx-auto min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-10 lg:px-0">

            {/* LEFT */}
            <div className="max-w-xl z-10 lg:pl-30 text-center lg:text-left mt-10 lg:mt-0">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={blurGone ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#2F5597] dark:text-[#8fb3e8] leading-tight"
              >
                Healthy Skin <br />
                Starts with <br />
                <span className="font-medium">DermaMind</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={blurGone ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="mt-6 text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl"
              >
                Simple, smart guidance to help you understand your skin.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={blurGone ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 w-full md:flex-row "
              >
<Link
  href="/DermaScan"
  className="w-full flex justify-center px-8 py-4 rounded-full font-medium text-[#57300C] dark:text-[#e0b088]
  bg-[#e0e0e0] dark:bg-[#2a2d3a]
  shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]
  dark:shadow-[6px_6px_12px_#1c1e27,-6px_-6px_12px_#383c4d]
  hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff6e]
  dark:hover:shadow-[inset_4px_4px_8px_#1c1e27,inset_-4px_-4px_8px_#383c4d]
  transition-all"
>
  Derma Scan
</Link>
              </motion.div>
            
          <motion.div
            animate={blurGone ? { y: [0, 6, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-10 flex justify-center mx-5 sm:mb-5 sm:mt-5 text-[#57300C] dark:text-[#e0b088] font-bold cursor-pointer text-sm sm:text-base"
          >
            Discover The Features in website{" "}
            <FontAwesomeIcon
      icon={faCircleChevronDown}
    />
          </motion.div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full lg:w-3/4 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1,
                  y: {
                    duration: 6,
                    repeat: Infinity,
                  },
                }}
              >
                <Image
                  src={Healthy}
                  alt="hero"
                  width={500}
                  height={500}
                  className="object-contain w-[280px] sm:w-[380px] md:w-[450px] lg:w-[500px] h-auto"
                  priority
                />
              </motion.div>
            </div>

          </div>
        </SwiperSlide>
      </Swiper>


    </section>
  )
}