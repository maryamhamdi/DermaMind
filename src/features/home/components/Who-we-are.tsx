'use client'
import Healthy from '../../../assets/images/Who-are-you.png'
import { motion } from "framer-motion";
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMicroscope,
  faPills,
  faBagShopping,
  faCalendar
} from "@fortawesome/free-solid-svg-icons"
export default function FeaturesInfo() {

 const features = [
  {
    icon: faMicroscope,
    title: "Diagnose Your Skin:-",
    desc: "Capture or upload an image now.",
  },
  {
    icon: faPills,
    title: "Smart Assistant:-",
    desc: "Ask anything about your case.",
  },
  {
    icon: faBagShopping,
    title: "Shop:-",
    desc: "Safe picks based on your condition.",
  },
  {
    icon: faCalendar,
    title: "Nearby Dermatologists:-",
    desc: "Find clinics & specialists near you.",
  },
];
  const MotionImage = motion(Image)

  return (
    <section className="bg-[#E6E6E6] dark:bg-[#20222c] min-h-screen flex items-center py-16 lg:py-0 overflow-hidden transition-colors duration-300">

      <div className="w-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 gap-12 lg:gap-0">

        {/* LEFT IMAGE */}
        
        <MotionImage
  src={Healthy}
  alt="Derma"
  width={500}
  height={500}
  className="object-contain w-[260px] sm:w-[320px] md:w-[380px] lg:w-[480px] xl:w-[445px]"
  initial={{ opacity: 0, x: -100 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
  viewport={{ once: true, amount: 0.4 }}
/>

        {/* RIGHT CONTENT */}
        <motion.div
          className="w-full max-w-xl lg:ml-20 text-center lg:text-left"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-light text-[#2F5597] dark:text-[#8fb3e8] leading-tight">
            Who We Are?
          </h1>

          <p className="mt-6 text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
  To empower users with accurate, easy-to-understand skincare insights
  while promoting safe and informed skin health decisions.
</p>

          {/* FEATURES */}
          <div className="mt-10 space-y-5">

            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-4 text-left">

                {/* ICON */}
                <div
                  className="
                    min-w-[42px] min-h-[42px] md:w-[45px] md:h-[45px]
                    rounded-full flex items-center justify-center
                    bg-[#733608] dark:bg-[#a85d2a]
                    shadow-[-2px_-2px_8px_#733608,-2px_-2px_12px_#733608,inset_2px_2px_4px_#733608,2px_2px_8px_#733608]
                    dark:shadow-[-2px_-2px_8px_#a85d2a,-2px_-2px_12px_#a85d2a,inset_2px_2px_4px_#a85d2a,2px_2px_8px_#a85d2a]
                  "
                >
                  <FontAwesomeIcon icon={item.icon} className="text-white" />
                </div>

                {/* TEXT */}
                <p className="text-[#656463] dark:text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
                  <span className="font-medium">{item.title}</span> {item.desc}
                </p>

              </div>
            ))}

          </div>
        </motion.div>

      </div>

    </section>
  );
}