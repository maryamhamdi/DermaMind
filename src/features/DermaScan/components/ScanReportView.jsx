"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faLightbulb,
  faSprayCanSparkles,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

export default function ScanReportView({ diagnosis, image }) {
   const handleNearbyPharmacy = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const response = await axios.get(
              "https://dermamind-api-production-a383.up.railway.app/api/Map/pharmacies",
              {
                params: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              }
            );
  
            window.open(response.data.mapsUrl, "_blank");
          },
          (err) => console.log(err)
        );
      } catch (err) {
        console.log(err);
      }
    };
  
  return (
    <section className="bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen pt-[75px] pb-20 transition-colors duration-300">
      <div className="flex flex-col items-center w-full max-w-[900px] mx-auto">
        {image && (
          <div className="w-full flex justify-center mt-16">
            <div className="relative w-full max-w-[520px] h-[220px] sm:h-[280px] md:h-[360px]">
              <Image src={image} alt="Scan" fill className="object-cover rounded-[20px]" />
              <div className="absolute inset-0 rounded-[20px] border-[3px] border-[#3DA5D9] shadow-[0_0_25px_rgba(61,165,217,0.7)] pointer-events-none" />
            </div>
          </div>
        )}

        <div className="mt-10 w-full flex flex-col items-center">
          <div className="mt-10 w-full max-w-[900px] bg-[#A9C3DB] dark:bg-[#2d3f52] rounded-[30px] p-4 sm:p-6 md:p-10 shadow-[inset_5px_5px_15px_rgba(0,0,0,0.15),inset_-5px_-5px_15px_rgba(255,255,255,0.6)] dark:shadow-[inset_5px_5px_15px_rgba(0,0,0,0.4),inset_-5px_-5px_15px_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-full bg-[#1B4F91] flex items-center justify-center">
                <FontAwesomeIcon icon={faStethoscope} className="text-white text-sm" />
              </div>
              <h2 className="text-[#1B4F91] dark:text-[#8fb3e8] font-bold text-xl">Final Assessment Result</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
              <div className="flex-1 bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-4 shadow-md">
                <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold mb-1">Condition :- <span className="text-[#8B5E3C] dark:text-[#d99a5b] text-base font-medium" dir="auto">
                  {diagnosis?.disease} {diagnosis?.name_ar && `(${diagnosis?.name_ar})`}
                </span>
                </p>
                
                <div className="h-px bg-gray-300 dark:bg-gray-600 my-3" />
                <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold mb-1">Confidence Level :-  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                  {diagnosis?.confidence_level}
                </span></p>
              </div>

              <div className="flex-1 bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-sm" />
                  <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold">Disclaimer :-</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-5" dir="auto">
                  {diagnosis?.disclaimer}
                </p>
              </div>
            </div>

            <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-6 shadow-md mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <FontAwesomeIcon icon={faLightbulb} className="text-[#8B5E3C] dark:text-[#d99a5b] text-sm" />
                <h3 className="font-semibold text-[#8B5E3C] dark:text-[#d99a5b]">Personalized Insight :-</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-7" dir="auto" style={{ textAlign: "justify" }}>
                {diagnosis?.personalized_insight}
              </p>
            </div>

            <div className="flex justify-center mb-2">
              <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-5 shadow-md w-full max-w-[600px]">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faSprayCanSparkles} className="text-[#8B5E3C] dark:text-[#d99a5b] text-sm" />
                  <h4 className="text-[#8B5E3C] dark:text-[#d99a5b] font-semibold">Initial Care Recommendations :-</h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-6" dir="auto" style={{ textAlign: "justify" }}>
                  {diagnosis?.care_recommendations}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-10">
            <Link
              href="/Chatbot"
              className="w-[300px] py-3 bg-[#1483DA] text-white rounded-xl shadow-md text-center"
            >
              Chat with Smart Assistant
            </Link>
            <Link
              href="/categories"
              className="w-[300px] py-3 bg-[#1483DA] text-white rounded-xl shadow-md text-center"
            >
              View Recommended Products
            </Link>
             <button
          className="w-[300px] py-3 bg-[#1483DA] text-white rounded-xl shadow-md text-center"
          onClick={handleNearbyPharmacy}
        >
          View nearby pharmacy
        </button>
          </div>
        </div>
      </div>
    </section>
  );
}