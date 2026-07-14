"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import {
  faVenus,
  faMars,
  faArrowLeft,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  getSkinQuestions,
  submitSkinTest,
  getSkinResult,
} from "../server/skinTest.action";

type Data = {
  gender?: string;
  age?: number | string;
  skinType?: string;
  experience?: string;
};

type SkinResult = {
  skinTypeCode: string;
  oD_Score: number;
  sR_Score: number;
  pN_Score: number;
  wT_Score: number;
  description: string;
  strategy: string;
  takenAt: string;
};

const stepVariants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SkinTest() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [skinResult, setSkinResult] = useState<SkinResult | null>(null);
  const router = useRouter();
  const [checkingResult, setCheckingResult] = useState(true);

  useEffect(() => {
    const savedStep = localStorage.getItem("skinStep");
    const savedData = localStorage.getItem("skinData");

    if (savedStep) setStep(Number(savedStep));
    if (savedData) setData(JSON.parse(savedData));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await getSkinQuestions();
        setQuestions(
          response.filter(
            (q: any) => q.questionText && q.questionText !== "string"
          )
        );
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setQuestionsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("skinStep", String(step));
    localStorage.setItem("skinData", JSON.stringify(data));
  }, [step, data, isLoaded]);

  const selectAnswer = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setSelectedOptionId(optionId);
  };

  useEffect(() => {
    const checkResult = async () => {
      try {
        const result = await getSkinResult();

        if (result) {
          setSkinResult(result);
          setStep(4);
        }
      } finally {
        setCheckingResult(false);
      }
    };

    checkResult();
  }, []);

  useEffect(() => {
    if (skinResult) {
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [skinResult]);

  const nextQuestion = () => {
    const currentQ = questions[currentQuestion];
    if (!answers[currentQ?.id]) {
      alert("Please select an answer");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      const nextQ = questions[currentQuestion + 1];
      setSelectedOptionId(answers[nextQ?.id] ?? null);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      const prevQ = questions[currentQuestion - 1];
      setSelectedOptionId(answers[prevQ?.id] ?? null);
    } else {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const selectedOptionIds = Object.values(answers);

      console.log("SELECTED IDS =>", selectedOptionIds);

      const result = await submitSkinTest(selectedOptionIds as number[]);

      console.log("RESULT =>", result);

      setSkinResult(result);

      localStorage.setItem("skinResult", JSON.stringify(result));

      localStorage.removeItem("skinStep");
      localStorage.removeItem("skinData");

      setStep(4);
    } catch (error) {
      console.error("Submit failed:", error);

      alert("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const NavButton = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      onClick={onClick}
      disabled={isSubmitting}
      className={`absolute bottom-4
sm:bottom-6 ${direction === "left" ? "left-6" : "right-6"}
      w-12 h-12
sm:w-14 sm:h-14 rounded-full flex items-center justify-center
      border border-black dark:border-[#3a3d4a] bg-[#E6E6E6] dark:bg-[#2a2d3a]
      shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_#ffffff]
      dark:shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.05)]
      active:shadow-inner transition disabled:opacity-50`}
    >
      <FontAwesomeIcon
        icon={direction === "left" ? faArrowLeft : faArrowRight}
        className="text-black dark:text-gray-200 text-xl"
      />
    </motion.button>
  );

  // ✅ كارت نتيجة score بشكل bar متحرك بدل النص الجامد
  const ScoreCard = ({ label, value }: { label: string; value: number }) => {
    const percentage = Math.min(Math.max(value, 0), 100);
    return (
      <motion.div
        variants={fadeUp}
        className="
          flex flex-col items-center justify-center
          gap-2 py-4 px-2 rounded-2xl
          bg-[#F2F2F2] dark:bg-[#20222c]
          shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]
          dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
        "
      >
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-lg sm:text-xl font-bold text-[#1687D6] dark:text-[#5a9fe8]">
          {value}
        </span>

        <div className="w-full h-1.5 rounded-full bg-gray-300/60 dark:bg-gray-600/40 overflow-hidden mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full bg-[#1687D6] dark:bg-[#5a9fe8]"
          />
        </div>
      </motion.div>
    );
  };

  if (checkingResult) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5D5D6] dark:bg-[#1a1c24] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
  w-[95%]
  sm:w-[90%]
  lg:w-[1000px]

  min-h-[500px]
  lg:h-auto

  rounded-[30px]
  lg:rounded-[50px]

  p-5
  sm:p-8
  lg:p-10

  text-center
  bg-[#E6E6E6] dark:bg-[#242732]
  mt-10 lg:mt-20
  mb-10
  relative
  overflow-hidden

  shadow-[inset_5px_5px_10px_rgba(0,0,0,0.15),inset_-5px_-5px_10px_rgba(255,255,255,1)]
  dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
"
      >
        <AnimatePresence mode="wait">
          {/* ================= STEP 1 — Gender ================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={stepVariants}
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-semibold text-[#6B3F16] dark:text-[#d99a5b] mt-10 mb-2"
              >
                What's Your gender?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 dark:text-gray-400 mb-8 text-lg"
              >
                This will help us adjust your routine steps based on your gender
              </motion.p>

              <motion.div
                initial="hidden"
                animate="show"
                variants={staggerContainer(0.15, 0.25)}
                className="flex flex-col md:flex-row justify-center gap-5 md:gap-4"
              >
                {["female", "male"].map((g) => (
                  <motion.button
                    key={g}
                    variants={fadeUp}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setData((prev) => ({ ...prev, gender: g }))}
                    className={`w-full
max-w-[180px]
sm:max-w-[220px]

h-[120px]
sm:h-[150px]
md:h-[200px] rounded-[30px] text-white
                    flex flex-col items-center justify-center gap-2 transition duration-300
                    ${
                      data.gender === g
                        ? "bg-[#565656] dark:bg-[#3a3d4a] scale-105 shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)]"
                        : "bg-[#1687D6]/65 dark:bg-[#1483DA]/50 hover:scale-105 shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)]"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={g === "female" ? faVenus : faMars}
                      className="text-[30px] mb-5"
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </motion.button>
                ))}
              </motion.div>

              <NavButton
                direction="right"
                onClick={() => {
                  if (!data.gender) return alert("Please select gender");
                  setStep(2);
                }}
              />
            </motion.div>
          )}

          {/* ================= STEP 2 — Age ================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={stepVariants}
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-semibold text-[#6B3F16] dark:text-[#d99a5b] mt-10 mb-2"
              >
                How old are you?
              </motion.h2>

              <motion.div
                initial="hidden"
                animate="show"
                variants={staggerContainer(0.1, 0.2)}
                className="flex flex-col items-center gap-4"
              >
                {[20, 21, 22].map((age) => (
                  <motion.button
                    key={age}
                    variants={fadeUp}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setData((prev) => ({ ...prev, age }))}
                    className={`w-full max-w-[300px] py-4 rounded-full text-white transition
                    ${
                      data.age === age
                        ? "bg-[#565656] dark:bg-[#3a3d4a] scale-105 shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)]"
                        : "bg-[#68AEEB] dark:bg-[#1483DA]/70 hover:scale-105 shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)]"
                    }`}
                  >
                    {age}
                  </motion.button>
                ))}

                <motion.input
                  variants={fadeUp}
                  type="number"
                  placeholder="Enter your age"
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, age: e.target.value }))
                  }
                  className="w-full max-w-[300px] py-4 px-4 rounded-full text-center outline-none
                  bg-[#E6E6E6] dark:bg-[#2a2d3a] text-black dark:text-gray-100 dark:placeholder-gray-500
                  shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2),inset_-5px_-5px_10px_#ffffff]
                  dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]"
                />
              </motion.div>

              <NavButton direction="left" onClick={() => setStep(1)} />

              <NavButton
                direction="right"
                onClick={() => {
                  if (!data.age) return alert("Please select or enter age");
                  setCurrentQuestion(0);
                  setSelectedOptionId(null);
                  setStep(3);
                }}
              />
            </motion.div>
          )}

          {/* ================= STEP 3 — Questions ================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={stepVariants}
            >
              {questionsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Loading questions...</p>
                </div>
              ) : (
                <div className="w-full max-w-[700px] mx-auto mt-4 md:mt-8 px-2">
                  {/* Progress */}
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>

                  <div className="w-full h-1.5 rounded-full bg-gray-300/60 dark:bg-gray-600/40 overflow-hidden mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#1687D6] dark:bg-[#5a9fe8]"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-8 text-center text-[#333] dark:text-gray-100">
                        {questions[currentQuestion]?.questionText ?? "No question"}
                      </h3>

                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={staggerContainer(0.08, 0.1)}
                        className="flex flex-col gap-3"
                      >
                        {questions[currentQuestion]?.options?.map((option: any) => (
                          <motion.button
                            key={option.id}
                            variants={fadeUp}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              selectAnswer(questions[currentQuestion].id, option.id)
                            }
                            disabled={isSubmitting}
                            className={`py-4 rounded-full text-white transition-all duration-300
                            ${
                              selectedOptionId === option.id
                                ? "bg-[#5A5A5A] dark:bg-[#3a3d4a] shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.2),inset_5px_5px_10px_rgba(0,0,0,0.4)]"
                                : "bg-[#68AEEB] dark:bg-[#1483DA]/70 shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)] hover:scale-105"
                            } disabled:opacity-50`}
                          >
                            {option.optionText}
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              <NavButton direction="left" onClick={prevQuestion} />
              <NavButton direction="right" onClick={nextQuestion} />
            </motion.div>
          )}

          {/* ================= STEP 4 — Result ================= */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={stepVariants}
              className="flex items-center justify-center py-8"
            >
              {isSubmitting ? (
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your result...</p>
              ) : !skinResult ? (
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No result found. Please try again.
                </p>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={staggerContainer(0.15, 0.1)}
                  className="
                    w-full
                    max-w-[320px]
                    sm:max-w-[450px]
                    md:max-w-[600px]

                    p-5
                    sm:p-8
                    lg:p-10
                    flex flex-col items-center
                    gap-6
                    relative
                  "
                >
                  {/* Glow pulse behind the check icon */}
                  <motion.div
                    variants={fadeUp}
                    className="relative"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#1687D6]/20 dark:bg-[#5a9fe8]/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                      className="
                        relative
                        w-16 h-16
                        sm:w-20 sm:h-20
                        lg:w-24 lg:h-24

                        text-3xl
                        sm:text-4xl
                        lg:text-5xl
                        rounded-full
                        flex items-center justify-center
                        bg-[#F2F2F2] dark:bg-[#20222c]
                        text-[#1687D6] dark:text-[#5a9fe8]
                        shadow-[inset_5px_5px_10px_rgba(0,0,0,0.15),inset_-5px_-5px_10px_rgba(255,255,255,1)]
                        dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                      "
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    variants={fadeUp}
                    className="text-xl
                    sm:text-2xl
                    lg:text-3xl font-bold text-[#6B3F16] dark:text-[#d99a5b]"
                  >
                    Skin Analysis Complete
                  </motion.h2>

                  {/* ✅ نوع البشرة كـ Badge بدل نص عادي */}
                  <motion.div
                    variants={fadeUp}
                    className="
                      inline-flex items-center gap-2 px-6 py-2 rounded-full
                      bg-gradient-to-br from-[#1687D6] to-[#0C81E4] dark:from-[#1483DA] dark:to-[#0C6BC0]
                      shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_#ffffff]
                      dark:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)]
                    "
                  >
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      {skinResult.skinTypeCode}
                    </span>
                  </motion.div>

                  {skinResult.description && (
                    <motion.p
                      variants={fadeUp}
                      className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center"
                    >
                      {skinResult.description}
                    </motion.p>
                  )}

                  {skinResult.strategy && (
                    <motion.div
                      variants={fadeUp}
                      className="
                        w-full rounded-2xl p-4 sm:p-5
                        bg-[#F2F2F2] dark:bg-[#20222c]
                        shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]
                        dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
                      "
                    >
                      <h4 className="text-sm sm:text-base font-semibold text-[#1687D6] dark:text-[#5a9fe8] mb-2">
                        Recommended Strategy
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-left">
                        {skinResult.strategy}
                      </p>
                    </motion.div>
                  )}

                  {/* ✅ الـ scores الأربعة بـ progress bars متحركة */}
                  <motion.div
                    variants={staggerContainer(0.1, 0.2)}
                    className="grid grid-cols-4 gap-2 sm:gap-3 w-full"
                  >
                    <ScoreCard label="OD" value={skinResult.oD_Score} />
                    <ScoreCard label="SR" value={skinResult.sR_Score} />
                    <ScoreCard label="PN" value={skinResult.pN_Score} />
                    <ScoreCard label="WT" value={skinResult.wT_Score} />
                  </motion.div>

                  <motion.button
                    variants={fadeUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="
                      px-6
                      sm:px-8
                      lg:px-10

                      py-3
                      lg:py-4
                      rounded-full
                      text-white
                      bg-[#1687D6] dark:bg-[#1483DA]
                      shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)]
                      dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.4)]
                      transition
                    "
                  >
                    Go To Home
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}