"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import img1 from "../../../assets/images/Analysis.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCloudArrowUp, faLightbulb, faSprayCanSparkles, faStethoscope, faSun, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faClock, faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

/* ================= API FUNCTIONS ================= */
const startDiagnosis = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("lang", "en");
  formData.append("medical_history", "none");

  const res = await fetch("/api/diagnose-start", {
    method: "POST",
    body: formData,
  });

  console.log("🔵 [diagnose-start] STATUS =>", res.status, res.statusText);

  const data = await res.json();
  console.log("🔵 [diagnose-start] BODY =>", data);

  return data;
};

const completeDiagnosis = async (modelResult, answers) => {
  const res = await fetch("/api/diagnose-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model_result: modelResult, answers }),
  });

  console.log("🟢 [diagnose-complete] STATUS =>", res.status, res.statusText);

  const data = await res.json();
  console.log("🟢 [diagnose-complete] BODY =>", data);

  return data;
};
/* =================================================== */

/* ================= Scan Overlay ================= */
const ScanOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 rounded-[24px] overflow-hidden z-10"
    >
      {/* dark blue tint */}
      <div className="absolute inset-0 bg-[#1483DA]/15 backdrop-blur-[1px]" />

      {/* glowing pulsing border */}
      <motion.div
        className="absolute inset-0 rounded-[24px] border-2 border-[#3DA5D9]"
        animate={{
          boxShadow: [
            "0 0 8px rgba(61,165,217,0.4)",
            "0 0 22px rgba(61,165,217,0.9)",
            "0 0 8px rgba(61,165,217,0.4)",
          ],
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[3px] bg-[#68AEEB] shadow-[0_0_15px_4px_rgba(104,174,235,0.8)]"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* corner brackets */}
      {[
        "top-2 left-2 border-t-2 border-l-2 rounded-tl-md",
        "top-2 right-2 border-t-2 border-r-2 rounded-tr-md",
        "bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md",
        "bottom-2 right-2 border-b-2 border-r-2 rounded-br-md",
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 border-[#3DA5D9] ${pos}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      {/* analyzing text */}
      <motion.div
        className="absolute bottom-3 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          Analyzing skin...
        </span>
      </motion.div>
    </motion.div>
  );
};
/* ================================================= */

/* ================= QUESTIONS FLOW (real API questions) ================= */
function QuestionsFlow({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const current = questions[index];

  const answer = (optionText) => {
    const updated = [...answers, { id: current.id, answer: optionText }];
    setAnswers(updated);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      onFinish(updated);
    }
  };

  if (!current) return null;

  return (
    <div className="mt-10 text-center max-w-[600px] mx-auto">
      <p className="text-[#6B3F16] dark:text-[#d99a5b] text-[18px] leading-[28px] mb-6">
        {current.question}
      </p>

      <div className="flex flex-col items-center gap-3">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt)}
            className="w-full max-w-[480px] py-3 px-4 bg-[#D9D9D9] dark:bg-[#2a2d3a] text-[#57300C] dark:text-[#e0b088] rounded-xl shadow-[6px_6px_14px_rgba(0,0,0,0.15),-6px_-6px_14px_#ffffff] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.4),-6px_-6px_14px_#383c4d] text-sm hover:bg-[#1483DA] hover:text-white transition"
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Question {index + 1} of {questions.length}
      </p>
    </div>
  );
}
/* ========================================================================= */

export default function DermaScan() {
  const fileInputRef = useRef(null);
  const [hideSideImages, setHideSideImages] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [modelResult, setModelResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);

  const diagnosis = finalResult;

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

  /* ================= STEP 1: UPLOAD IMAGE -> diagnose/start ================= */
  const handleFile = async (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setIsScanning(true);
    setError(null);
    setHideSideImages(true);

    try {
      const data = await startDiagnosis(file);
      console.log("🔥 START RESULT:", data);

      if (!data?.questions?.length) {
        setError("لم يتم استرجاع أسئلة من السيرفر");
        return;
      }

      setQuestions(data.questions);
      setModelResult(data.model_result);
      setShowInstructions(false);
      setShowQuestions(true);
    } catch (err) {
      console.error("❌ START ERROR:", err);
      setError("حدث خطأ أثناء تحليل الصورة");
    } finally {
      setIsScanning(false);
    }
  };
  /* =========================================================================== */

  /* ================= STEP 2: ANSWERS -> diagnose/complete ================= */
  const handleQuestionsFinish = async (answers) => {
    setShowQuestions(false);
    setIsCompleting(true);
    setError(null);

    try {
      const data = await completeDiagnosis(modelResult, answers);
      console.log("=================================");
      console.log("FINAL RESULT");
      console.log(JSON.stringify(data, null, 2));
      console.log("=================================");
      console.log("MODEL RESULT");
      console.log(JSON.stringify(modelResult, null, 2));

      if (data?.error) {
        setError(data.message || "حدث خطأ في تحديد النتيجة النهائية");
        setIsCompleting(false);
        return;
      }

      setFinalResult(data);
      setShowResult(true);

      try {
        localStorage.setItem("diagnosisContext", JSON.stringify(data));
      } catch (storageErr) {
        console.error("❌ Failed to save diagnosisContext:", storageErr);
      }

      const top = data?.model_result?.top3?.[0] || data?.top3?.[0];
      localStorage.setItem(
        "latestAnalysis",
        JSON.stringify({
          disease: top?.disease,
          confidence: top?.confidence,
          insight: top?.personalized_insight,
          recommendations: top?.care_recommendations,
          date: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("❌ COMPLETE ERROR:", err);
      setError("حدث خطأ أثناء إنهاء التحليل");
    } finally {
      setIsCompleting(false);
    }
  };
  /* =========================================================================== */

  const resetImage = () => {
    setImage(null);
    setIsScanning(false);
    setIsCompleting(false);
    setHideSideImages(false);
    setShowQuestions(false);
    setShowInstructions(true);
    setShowResult(false);
    setQuestions([]);
    setFinalResult(null);
    setError(null);
  };

  return (
    <section className="bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen pt-[75px] transition-colors duration-300">
      <div
        className={`w-full mx-auto flex flex-col lg:flex-row items-start gap-16 transition-all duration-500 ${
          hideSideImages ? "justify-center" : ""
        }`}
      >
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`flex flex-col items-center w-full ${
            hideSideImages ? "max-w-[900px] mx-auto" : ""
          }`}
        >
          {!showResult && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              className={`
                bg-[#68aeeb6b] dark:bg-[#1483DA]/20
                rounded-[40px]
                shadow-[inset_5px_5px_10px_rgba(22,27,29,0.25),inset_-5px_-5px_10px_#FAFBFF]
                dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                mt-[60px]
                mx-auto
                relative
                overflow-hidden
                flex
                items-center
                justify-center
                ${image
                  ? "inline-flex p-4 sm:p-6 md:p-8"
                  : "w-full max-w-[800px] h-[250px] sm:h-[320px] md:h-[400px]"
                }
              `}
            >
              {/* BEFORE */}
              {!image && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-[#D9D9D9]/50 dark:bg-[#2a2d3a]/60 shadow-[inset_-8px_-8px_25px_#4A8A9E,inset_8px_8px_25px_#FFFFFF] dark:shadow-[inset_-8px_-8px_25px_#0d0e12,inset_8px_8px_25px_#2c2f3d]" />
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="text-3xl relative z-50 dark:text-gray-200"
                    />
                  </div>

                  <p className="text-[#6B3F16] dark:text-[#d99a5b] text-[18px] text-center leading-[28px]">
                    Drag & Drop your image <br />
                    <span className="text-[18px]">or</span>
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                  />

                  <motion.button
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => fileInputRef.current.click()}
                    className="mt-4 px-10 py-3 text-black dark:text-gray-100 rounded-full bg-[#D9D9D9] dark:bg-[#2a2d3a] shadow-[6px_6px_14px_rgba(0,0,0,0.2),-6px_-6px_14px_#ffffff] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_#383c4d]"
                  >
                    Browse File
                  </motion.button>
                </div>
              )}

              {/* IMAGE */}
              {image && (
                <div className="relative">
                  <Image
                    src={image}
                    alt="Uploaded"
                    width={300}
                    height={300}
                    className="
                      object-cover
                      w-[220px]
                      h-[220px]
                      sm:w-[260px]
                      sm:h-[260px]
                      md:w-[300px]
                      md:h-[300px]
                      rounded-[24px]
                    "
                  />

                  {(isScanning || isCompleting) && (
                    <motion.div
                      className="absolute inset-0 rounded-[24px] pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                        backgroundSize: "200% 200%",
                      }}
                      animate={{ backgroundPositionX: ["-100%", "200%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  <button
                    onClick={resetImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white z-20"
                  >
                    ✕
                  </button>

                  {(isScanning || isCompleting) && <ScanOverlay />}
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-4 text-center max-w-[500px]">
              {error}
            </p>
          )}

          {/* INSTRUCTIONS */}
          {showInstructions && (
            <div className="
              mt-10
              w-full
              max-w-[860px]
              px-4
              sm:px-8
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-x-10
              lg:gap-x-[120px]
              gap-y-5
            ">
              <div className="flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-xl bg-[#1483DA] flex items-center justify-center">
                  <FontAwesomeIcon icon={faFaceSmile} className="text-white text-[14px]" />
                </div>
                <span className="text-[#57300C] dark:text-[#e0b088]">Relax your face.</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-xl bg-[#1483DA] flex items-center justify-center">
                  <FontAwesomeIcon icon={faBan} className="text-white text-[14px]" />
                </div>
                <span className="text-[#57300C] dark:text-[#e0b088]">Do not apply any products.</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-xl bg-[#1483DA] flex items-center justify-center">
                  <FontAwesomeIcon icon={faSun} className="text-white text-[14px]" />
                </div>
                <span className="text-[#57300C] dark:text-[#e0b088]">Sit in a good lighting.</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-xl bg-[#1483DA] flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="text-white text-[14px]" />
                </div>
                <span className="text-[#57300C] dark:text-[#e0b088]">Stay still for a few seconds.</span>
              </div>
            </div>
          )}

          {/* QUESTIONS (REAL FROM API) */}
          {showQuestions && questions.length > 0 && (
            <QuestionsFlow questions={questions} onFinish={handleQuestionsFinish} />
          )}

          {isCompleting && (
            <p className="text-[#1483DA] dark:text-[#5a9fe8] mt-6 text-sm">جاري تحديد النتيجة النهائية...</p>
          )}

          {/* RESULT */}
          {showResult && finalResult && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="flex flex-col items-center w-full mt-10"
            >
              {/* IMAGE RESULT */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                }}
                className="w-full flex justify-center"
              >
                <div className="
                  relative
                  w-full
                  max-w-[520px]
                  h-[220px]
                  sm:h-[280px]
                  md:h-[360px]
                ">
                  <Image
                    src={image}
                    alt="Uploaded"
                    fill
                    className="object-cover rounded-[20px]"
                  />

                  <motion.div
                    className="absolute inset-0 rounded-[20px] border-[3px] border-[#3DA5D9] pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(61,165,217,0.4)",
                        "0 0 25px rgba(61,165,217,0.8)",
                        "0 0 10px rgba(61,165,217,0.4)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#3DA5D9] rounded-tl-[20px]" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#3DA5D9] rounded-tr-[20px]" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#3DA5D9] rounded-bl-[20px]" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#3DA5D9] rounded-br-[20px]" />
                </div>
              </motion.div>

              {/* RESULT CARD */}
              <div className=" w-full flex flex-col items-center">
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  className="mt-10 md:mt-16
                    w-full
                    max-w-[900px]
                    bg-[#A9C3DB] dark:bg-[#2d3f52]
                    rounded-[30px]
                    p-4 sm:p-6 md:p-10 shadow-[inset_5px_5px_15px_rgba(0,0,0,0.15),inset_-5px_-5px_15px_rgba(255,255,255,0.6)]
                    dark:shadow-[inset_5px_5px_15px_rgba(0,0,0,0.4),inset_-5px_-5px_15px_rgba(255,255,255,0.05)]"
                >
                  <FontAwesomeIcon icon={faStethoscope} className="text-white text-sm" />
                  <h2 className="text-center text-[#1B4F91] dark:text-[#8fb3e8] font-bold text-xl mb-8">
                    Final Assessment Result
                  </h2>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    className="
                      flex
                      flex-col
                      md:flex-row
                      gap-4
                      md:gap-6
                      mb-6
                    "
                  >
                    <div className="flex-1 bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-4 shadow-md">
                      <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold">
                        Condition:
                        <span className="text-[#8B5E3C] dark:text-[#d99a5b] font-normal ml-2">
                          {diagnosis?.disease} ({diagnosis?.name_ar})
                        </span>
                      </p>

                      <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold mt-2">
                        Confidence Level:
                        <span className="text-[#8B5E3C] dark:text-[#d99a5b] font-normal ml-2">
                          {diagnosis?.confidence_level}
                        </span>
                      </p>
                    </div>

                    <div className="flex-1 bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-4 shadow-md flex flex-col justify-center">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-sm" />
                      <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold">Disclaimer</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {diagnosis?.disclaimer}
                      </p>
                    </div>
                  </motion.div>

                  {/* INSIGHT */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-6 shadow-md mb-6"
                  >
                    <FontAwesomeIcon icon={faLightbulb} className="text-[#8B5E3C] dark:text-[#d99a5b] text-sm" />
                    <h3 className="text-center font-semibold text-[#8B5E3C] dark:text-[#d99a5b] mb-3">
                      Personalized Insight
                    </h3>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-6 text-center">
                      {diagnosis?.personalized_insight}
                    </p>
                  </motion.div>

                  {/* RECOMMENDATIONS */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    className="flex justify-center mb-6"
                  >
                    <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-4 shadow-md w-full max-w-[300px] text-center">
                      <FontAwesomeIcon icon={faSprayCanSparkles} className="text-[#8B5E3C] dark:text-[#d99a5b] text-sm" />
                      <h4 className="text-[#8B5E3C] dark:text-[#d99a5b] font-semibold mb-2">
                        Initial Care Recommendations
                      </h4>

                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {diagnosis?.care_recommendations}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { duration: 0.5 } },
                  }}
                  className="text-center text-red-500 dark:text-red-400 text-xs mt-10 max-w-[700px]"
                >
                  ⚠️ This assessment is generated based on AI analysis and user-provided information.
                  <br />
                  It is not a final medical diagnosis. Please consult a certified
                  <br />
                  dermatologist for professional evaluation and treatment.
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  className="flex flex-col items-center gap-4 mt-10"
                >
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
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT IMAGE */}
        {!hideSideImages && (
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <Image
              src={img1}
              alt="Derma Scan"
              className="
                hidden
                lg:block
                w-[300px]
                xl:w-[395px]
                object-contain
                select-none
              "
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}