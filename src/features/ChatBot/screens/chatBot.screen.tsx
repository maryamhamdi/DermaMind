'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPaperPlane,
  faTableList,
  faComments,
  faCopy,
  faCheck,
  faCommentDots,
  faPen,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faBars,
  faXmark,
  faStethoscope,
  faLightbulb,
  faSprayCanSparkles,
  faTriangleExclamation,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import bgChat from "../../../assets/images/bgchat.png";
import { sendMessage } from "@/src/features/ChatBot/server/chatbot.action";
import Image from "next/image";
import logo from "@/src/assets/images/logo.png";

const MotionImage = motion(Image);

// ── Static Data ───────────────────────────────────────────────────
const BROWSE_PROMPTS = [
  "What is eczema?",
  "Best moisturizer for dry skin?",
  "How to treat acne naturally?",
  "What causes skin rashes?",
  "What is rosacea?",
];

type ChatSession = {
  id: string;
  title: string;
  messages: any[];
};

// ── Small Components ──────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="w-16 h-16 min-w-[64px] rounded-full bg-white dark:bg-[#2a2d3a] shadow-lg flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <path
          d="M11 30V12l9 11 9-11v18"
          stroke="#1b6fc8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function UserAvatar({ letter = "You" }: { letter?: string }) {
  return (
    <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-br from-[#5ab2f2] to-[#1b6fc8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
      {letter}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="bg-white dark:bg-[#20222c] border border-[#dce8f5] dark:border-[#383c4d] rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#80baea] animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function BotMessage({ msg }: { msg: { text: string } }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"up" | "down" | null>(null);

  const copy = () => {
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-start gap-4 message-appear">
      <div className="w-full sm:w-[90%] lg:w-[80%] bg-[#dbdbdbe1] dark:bg-[#20222ce1] border border-[#dce8f5] dark:border-[#383c4d] rounded-[24px] sm:rounded-[35px] px-4 sm:px-8 py-4 sm:py-5 shadow-md">
        <div className="flex items-start gap-3 sm:gap-6">
          <div className="w-[42px] h-[42px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0">
            <Image src={logo} alt="DermaMind" width={48} height={48} className="object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[0.95rem] sm:text-[1.1rem] text-[#5f5f5f] dark:text-gray-200 font-semibold leading-7 sm:leading-9 whitespace-pre-wrap break-words">
              {msg.text}
            </p>

            <div className="flex items-center gap-3 sm:gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  animate={liked === "up" ? { scale: [1, 1.25, 1.1] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLiked(liked === "up" ? null : "up")}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)] ${
                    liked === "up" ? "bg-[#2196F3] text-white" : "bg-[#E0E0E0] dark:bg-[#2a2d3a] text-[#555] dark:text-gray-300"
                  }`}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  animate={liked === "down" ? { scale: [1, 1.25, 1.1] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLiked(liked === "down" ? null : "down")}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)] ${
                    liked === "down" ? "bg-red-500 text-white" : "bg-[#E0E0E0] dark:bg-[#2a2d3a] text-[#555] dark:text-gray-300"
                  }`}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                </motion.button>
              </div>

              <button
                onClick={copy}
                className="ml-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)]"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-green-500" : "dark:text-gray-300"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: { text: string } }) {
  return (
    <div className="flex items-start gap-3 flex-row-reverse message-appear">
      <div className="w-full sm:w-[85%] lg:w-[72%] bg-[#dbdbdbe1] dark:bg-[#20222ce1] border border-[#dce8f5] dark:border-[#383c4d] rounded-[24px] sm:rounded-[35px] px-4 sm:px-5 py-3 shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[0.95rem] sm:text-[1.1rem] text-[#5f5f5f] dark:text-gray-200 font-semibold whitespace-pre-wrap break-words">
              {msg.text}
            </p>
          </div>
          <div className="w-[42px] h-[42px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0">
            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Report Card Message (auto-injected from DermaScan result) ─────
function ReportCardMessage({ report }: { report: any }) {
  if (!report) return null;

  return (
    <div className="flex items-start gap-3 message-appear">
      <div className="w-full sm:w-[92%] lg:w-[85%] mx-auto bg-[#A9C3DB] dark:bg-[#2d3f52] border border-[#8fb3d8] dark:border-[#3f5f8f] rounded-[24px] sm:rounded-[28px] px-4 sm:px-6 py-4 sm:py-5 shadow-md">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FontAwesomeIcon icon={faStethoscope} className="text-[#1B4F91] dark:text-[#8fb3e8]" />
          <h3 className="text-[#1B4F91] dark:text-[#8fb3e8] font-bold text-sm sm:text-base">
            Skin Assessment Report
          </h3>
        </div>

        <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-3 sm:p-4 mb-3">
          <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold text-sm">
            Condition:
            <span className="text-[#8B5E3C] dark:text-[#d99a5b] font-normal ml-2">
              {report.disease}
              {report.name_ar ? ` (${report.name_ar})` : ""}
            </span>
          </p>
          <p className="text-[#1B4F91] dark:text-[#8fb3e8] font-semibold text-sm mt-1">
            Confidence Level:
            <span className="text-[#8B5E3C] dark:text-[#d99a5b] font-normal ml-2">
              {report.confidence_level}
            </span>
          </p>
        </div>

        {report.personalized_insight && (
          <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-3 sm:p-4 mb-3">
            <p className="text-[#8B5E3C] dark:text-[#d99a5b] font-semibold text-xs sm:text-sm mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} />
              Personalized Insight
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-6">
              {report.personalized_insight}
            </p>
          </div>
        )}

        {report.care_recommendations && (
          <div className="bg-[#EDEDED] dark:bg-[#20222c] rounded-2xl p-3 sm:p-4 mb-3">
            <p className="text-[#8B5E3C] dark:text-[#d99a5b] font-semibold text-xs sm:text-sm mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faSprayCanSparkles} />
              Initial Care Recommendations
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {report.care_recommendations}
            </p>
          </div>
        )}

        {report.disclaimer && (
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-2">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 mt-[2px]" />
            {report.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Pinned "Doctor Derma" intro banner ─────────────────────────────
function PinnedDoctorBanner() {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-[#1483DA]/12 dark:bg-[#1483DA]/15 border-b border-[#dce8f5] dark:border-[#383c4d] flex-shrink-0 relative z-20">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1483DA] flex items-center justify-center text-white shrink-0 shadow">
        <FontAwesomeIcon icon={faUserDoctor} className="text-sm sm:text-base" />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-[#1b6fc8] dark:text-[#6fa8dc] text-sm sm:text-[0.95rem] leading-tight">
          I'm Doctor Derma 🩺
        </p>
        <p className="text-[11px] sm:text-xs text-[#5f7282] dark:text-gray-400 leading-tight truncate">
          Your AI dermatology assistant — ask me anything about your skin report
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
};

export default function AllProductsScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false); // mobile drawer
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop collapse (like ChatGPT)
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(true);
  const [activeHistory, setActiveHistory] = useState<number | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<{ role: string; content: string }[]>([]);

  // ✅ يحمل نتيجة DermaScan (لو موجودة) عشان يتبعت تلقائي مع كل رسالة
  const diagnosisContextRef = useRef<string>("");

  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Bootstrap عند فتح الصفحة: يحمّل قائمة المحادثات، وبعدين يقرر إيه اللي
  // يظهر في الشات المفتوح دلوقتي:
  //   1) لو فيه تقرير جديد جاي من DermaScan -> الأولوية له (محادثة جديدة)
  //   2) لو لا -> يرجّع آخر محادثة كانت مفتوحة قبل الـ refresh (لو موجودة)
  //
  // ⚠️ ملاحظة مهمة: في Next.js dev mode (React Strict Mode) الـ effect ده
  // ممكن يتنفّذ مرتين عند الـ mount. وبما إنه بيشيل "diagnosisContext" من
  // localStorage بعد أول قراءة (عشان يُستهلك مرة واحدة)، المرة التانية كانت
  // بترجع تقرا "chatHistory" القديمة من localStorage وتدهس الشات الجديد
  // اللي لسه متخزّن بس في الـ state ولم يُكتب على القرص بعد. الحارس ده يمنع
  // المنطق من التنفيذ غير مرة واحدة فعلية.
  const bootstrappedRef = useRef(false);
  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    let history: ChatSession[] = [];
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) history = JSON.parse(savedHistory);
    } catch (e) {
      console.error("❌ Failed to parse chatHistory:", e);
    }
    setChatHistory(history);

    // 1) تقرير جديد من DermaScan
    try {
      const savedReport = localStorage.getItem("diagnosisContext");
      if (savedReport) {
        localStorage.removeItem("diagnosisContext"); // يُستهلك مرة واحدة فقط

        let parsedReport: any = null;
        try {
          parsedReport = JSON.parse(savedReport);
        } catch {
          parsedReport = null;
        }

        if (parsedReport) {
          diagnosisContextRef.current = savedReport;

          const chatId = Date.now().toString();
          const reportMessage = {
            id: `${chatId}-report`,
            role: "report",
            report: parsedReport,
            text: savedReport,
          };
          const greetingText = `👋 Hi, I'm Doctor Derma. I've received your skin assessment report above${
            parsedReport.disease ? ` about **${parsedReport.disease}**` : ""
          }. Feel free to ask me anything about it!`;
          const greetingMessage = {
            id: `${chatId}-greeting`,
            role: "bot",
            text: greetingText,
          };

          const newSession: ChatSession = {
            id: chatId,
            title: parsedReport.disease ? `Report: ${parsedReport.disease}` : "Skin Report",
            messages: [
              { role: "report", text: savedReport },
              { role: "bot", text: greetingText },
            ],
          };

          setMessages([reportMessage, greetingMessage]);
          setCurrentChatId(chatId);
          setActiveHistory(0);
          setShowSuggest(false);
          setChatHistory([newSession, ...history]);
          localStorage.setItem("lastChatId", chatId);
          setHistoryLoaded(true);
          return; // تمت معالجة الحالة دي، مفيش حاجة تانية نعملها
        }
      }
    } catch (e) {
      console.error("❌ Failed to read diagnosisContext:", e);
    }

    // 2) مفيش تقرير جديد -> رجّع آخر محادثة كانت مفتوحة بعد الـ refresh
    try {
      const lastChatId = localStorage.getItem("lastChatId");
      if (lastChatId) {
        const idx = history.findIndex((c) => c.id === lastChatId);
        if (idx !== -1) {
          const chat = history[idx];
          const restored = chat.messages.map((m: any, i: number) => {
            const base: any = { ...m, id: m.id ?? `${chat.id}-${i}` };
            if (m.role === "report") {
              try {
                base.report = JSON.parse(m.text);
              } catch {
                base.report = null;
              }
            }
            return base;
          });

          setMessages(restored);
          setCurrentChatId(chat.id);
          setActiveHistory(idx);
          setShowSuggest(restored.length === 0);

          contextRef.current = chat.messages
            .filter((m: any) => m.role !== "report")
            .map((m: any) => ({ role: m.role, content: m.text }));

          const reportMsg = chat.messages.find((m: any) => m.role === "report");
          diagnosisContextRef.current = reportMsg ? reportMsg.text : "";
        }
      }
    } catch (e) {
      console.error("❌ Failed to restore last chat:", e);
    }

    setHistoryLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory, historyLoaded]);

  // ✅ يحفظ آخر محادثة مفتوحة عشان نقدر نرجّعها تلقائي بعد أي refresh
  useEffect(() => {
    if (!historyLoaded) return;
    if (currentChatId) {
      localStorage.setItem("lastChatId", currentChatId);
    } else {
      localStorage.removeItem("lastChatId");
    }
  }, [currentChatId, historyLoaded]);

  const callAPI = async (userText: string) => {
    const historyStrings = contextRef.current.map(
      (m) => `${m.role}: ${m.content}`
    );

    const response = await sendMessage(
      userText,
      historyStrings,
      diagnosisContextRef.current
    );

    if (!response.success) throw new Error(response.error);
    return response.data.response;
  };

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const newChatSession: ChatSession = { id: chatId, title: msg, messages: [] };
      setCurrentChatId(chatId);
      setChatHistory((prev) => [newChatSession, ...prev]);
    }

    setInput("");
    setMessages((p) => [...p, { id: Date.now(), role: "user", text: msg }]);
    setShowSuggest(false);
    setLoading(true);

    try {
      const reply = await callAPI(msg);
      const botMessage = { id: Date.now() + 1, role: "bot", text: reply };
      setMessages((p) => [...p, botMessage]);

      // ✅ نسجل التبادل في contextRef عشان يتبعت كـ history في الطلب الجاي
      contextRef.current.push({ role: "user", content: msg });
      contextRef.current.push({ role: "bot", content: reply });

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "user", text: msg },
                  { role: "bot", text: reply },
                ],
              }
            : chat
        )
      );
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          role: "bot",
          text: "⚠️ DermaBot is currently busy. Please try again in a minute.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    contextRef.current = [];
    diagnosisContextRef.current = "";
    setActiveHistory(null);
    setMessages([]);
    setCurrentChatId(null);
  };

  const newChat = () => {
    contextRef.current = [];
    diagnosisContextRef.current = "";
    setInput("");
    setActiveHistory(null);
    setMessages([]);
    setCurrentChatId(null);
  };

  const deleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const renameChat = (id: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
    );
  };

  const suggestions = BROWSE_PROMPTS.filter(
    (p) => !input || p.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(20px)", y: 40 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <div
          className="h-screen bg-[#D6D6D6] dark:bg-[#1a1c24] flex flex-col overflow-hidden select-none transition-colors duration-300"
          style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif" }}
        >
          {/* MAIN */}
          <div
            className="
              relative z-10
              flex flex-col xl:flex-row
              gap-4 sm:gap-5 xl:gap-6
              p-3 sm:p-5
              xl:pl-28
              flex-1
              min-h-0
              mt-16 sm:mt-20
            "
          >
            {/* FLOATING ACTION BUTTONS */}
            <div
              className="
                absolute
                left-3 bottom-6 top-auto translate-y-0
                lg:left-6 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto
                flex flex-col gap-4 sm:gap-6
                z-50
              "
            >
              <button
                onClick={clearChat}
                className="hidden xl:flex group items-center bg-black dark:bg-[#2a2d3a] text-white rounded-full overflow-hidden transition-all duration-300 w-[48px] sm:w-[55px] hover:w-[170px] sm:hover:w-[180px] h-[48px] sm:h-[55px]"
              >
                <div className="w-[48px] sm:w-[55px] h-[48px] sm:h-[55px] flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faTrashCan} className="text-lg sm:text-xl" />
                </div>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-6 font-semibold">
                  Clear Chat
                </span>
              </button>

              <button
                onClick={newChat}
                className="group flex items-center overflow-hidden bg-black dark:bg-[#2a2d3a] text-white rounded-full h-[48px] sm:h-[55px] w-[48px] sm:w-[55px] hover:w-[160px] sm:hover:w-[170px] transition-all duration-300"
              >
                <div className="w-[48px] sm:w-[55px] h-[48px] sm:h-[55px] flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faPlus} />
                </div>

                <button
  onClick={newChat}
  className="
    flex items-center justify-center
    w-12 h-12 rounded-full bg-black dark:bg-[#2a2d3a] text-white
    xl:hidden
    fixed bottom-24 right-4
    shadow-lg
  "
>
  <FontAwesomeIcon icon={faPlus} />
</button>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-6 font-semibold">
                  New Chat
                </span>
              </button>
            </div>

            {/* CHAT PANEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(30px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                boxShadow: [
                  "0 0 0 rgba(72,171,232,0)",
                  "0 0 60px rgba(72,171,232,.25)",
                  "0 0 0 rgba(72,171,232,0)",
                ],
              }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className={`
                flex-1 relative bg-white/55 dark:bg-[#20222c]/70 opacity-[0.9] backdrop-blur-md
                rounded-[20px] sm:rounded-[30px] flex flex-col overflow-hidden
                ${messages.length > 0 ? "animate-bg-show" : ""}
              `}
            >
              {messages.length > 0 && (
                <MotionImage
                  src={bgChat}
                  alt="Chat Bot"
                  width={340}
                  height={340}
                  animate={{ y: [0, -15, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-[200px] sm:w-[280px] lg:w-[340px] h-auto dark:opacity-70"
                />
              )}

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between px-4 sm:px-6 py-[16px] sm:py-[20px] flex-shrink-0 bg-[#7f909f99] dark:bg-[#2a2d3a99] border-b-0 border border-[#dce8f5] dark:border-[#383c4d]">
                  <motion.h2
                      variants={itemVariants}
                      className="font-bold text-[#4d4e4f] dark:text-gray-200 text-[1.2rem] sm:text-[1.5rem] tracking-tight"
                    >
                      Super Chat
                    </motion.h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowHistory(true)}
                      className="xl:hidden w-10 h-10 rounded-full bg-white dark:bg-[#2a2d3a] shadow"
                    >
                      <FontAwesomeIcon
    icon={faBars}
    className="text-[#1b6fc8] dark:text-[#6fa8dc] text-lg"
  />
                    </button>

                    {/* desktop collapse toggle */}
                    <button
                      onClick={() => setSidebarOpen((v) => !v)}
                      className="hidden xl:flex w-10 h-10 rounded-full bg-white dark:bg-[#2a2d3a] shadow items-center justify-center"
                    >
                      <FontAwesomeIcon icon={sidebarOpen ? faChevronRight : faChevronLeft} className="dark:text-gray-300" />
                    </button>

                    
                  </div>
                </div>
              </motion.div>

              {/* ✅ Pinned "I'm Doctor Derma" banner — always visible under the header */}
              <PinnedDoctorBanner />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 min-h-0 scroll-smooth relative z-50">
                {!hasStartedChat ? (
                  <motion.div
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                    className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6"
                  >
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, delay: 1.2 }}
                      className="text-[24px] sm:text-[36px] lg:text-[48px] font-bold text-[#4d4e4f] dark:text-gray-200"
                    >
                      How can I help you today?
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8, duration: 0.8 }}
                      className="mt-3 text-[#7f8a94] dark:text-gray-400 text-[14px] sm:text-[18px] lg:text-[20px]"
                    >
                      Ask anything about skincare and dermatology
                    </motion.p>
                  </motion.div>
                ) : (
                  <div className="relative z-10 space-y-6 sm:space-y-8">
                    {messages.map((msg) =>
                      msg.role === "bot" ? (
                        <BotMessage key={msg.id} msg={msg} />
                      ) : msg.role === "report" ? (
                        <ReportCardMessage key={msg.id} report={msg.report} />
                      ) : (
                        <UserMessage key={msg.id} msg={msg} />
                      )
                    )}
                    {loading && <TypingIndicator />}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input area */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 2.2 }}
                className="px-2 sm:px-4 pb-4"
              >
                <motion.div
                  animate={
                    !hasStartedChat
                      ? {
                          boxShadow: [
                            "0 0 0 rgba(27,111,200,0)",
                            "0 0 25px rgba(27,111,200,0.18)",
                            "0 0 0 rgba(27,111,200,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="
                    bg-white/70 dark:bg-[#20222c]/80 backdrop-blur-md
                    rounded-[28px] sm:rounded-[40px]
                    px-4 sm:px-5
                    pt-[16px] sm:pt-[20px]
                    pb-2
                    shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(0,0,0,0.12)]
                    dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.05),8px_8px_20px_rgba(0,0,0,0.4)]
                  "
                >
                  <input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setShowSuggest(!e.target.value.trim());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Ask or search anything"
                    className="
                      w-full h-[35px] bg-transparent outline-none
                      text-[15px] sm:text-[18px] lg:text-[20px]
                      text-[#6b7280] dark:text-gray-200 placeholder:text-[#8d96a0] dark:placeholder:text-gray-500
                    "
                  />

                  {!hasStartedChat && showSuggest && suggestions.length > 0 && (
                   <div className="mt-4 sm:mt-5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                      {suggestions.map((item) => (
                        <button
  key={item}
  onClick={() => send(item)}
  className="
    flex-shrink-0
    bg-white dark:bg-[#2a2d3a] rounded-[30px]
    px-4 py-2
    text-[13px] sm:text-sm
    shadow-md text-[#4b5563] dark:text-gray-300
    hover:scale-105 transition
  "
>
  {item}
</button>
                      ))}
                    </div>
                  )}

                  <div
                    className="
                      mt-3 h-[55px] sm:h-[60px] rounded-full bg-[#C8D4E0] dark:bg-[#2a2d3a]
                      px-3 sm:px-4 flex items-center justify-between
                    "
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <button
                        className="
                          h-[40px] sm:h-[45px] px-3 sm:px-5 rounded-full bg-white dark:bg-[#20222c]
                          flex items-center gap-2 shadow-md text-[13px] sm:text-base
                          text-[#4b5563] dark:text-gray-300
                        "
                      >
                        <FontAwesomeIcon icon={faTableList} />
                        <span className="hidden sm:inline">Derma Tools</span>
                      </button>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => send()}
                        disabled={loading || !input.trim()}
                        className="
                          w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full bg-[#E0E0E0] dark:bg-[#20222c]
                          flex items-center justify-center
                          shadow-[-2px_-2px_8px_rgba(255,255,255,1),_2px_2px_8px_rgba(0,0,0,0.3)]
                          dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.08),_2px_2px_8px_rgba(0,0,0,0.5)]
                          disabled:opacity-50
                        "
                      >
                        <FontAwesomeIcon icon={faPaperPlane} className="dark:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* HISTORY SIDEBAR — collapsible like ChatGPT */}
            <AnimatePresence initial={false}>
              {(sidebarOpen || showHistory) && (
                <motion.div
                  key="sidebar"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`
                   fixed top-[80px] right-0
h-[calc(100vh-90px)] w-[280px]
                    bg-[#fff9] dark:bg-[#20222cee] backdrop-blur-md z-[999]
                    rounded-[30px] border border-[#125bb5] dark:border-[#3f5f8f]
                    transition-transform duration-300
                    ${showHistory ? "translate-x-0" : "translate-x-full"}
                    xl:translate-x-0 xl:static xl:h-auto xl:w-[260px] xl:min-w-[240px]
                    overflow-hidden
                  `}
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-[16px] border-b border-[#125bb5] dark:border-[#3f5f8f] flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#48abe8] to-[#1b6fc8] flex items-center justify-center shadow flex-shrink-0">
                        <FontAwesomeIcon icon={faComments} className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-gray-200 text-[0.95rem]">History Chat</h3>
                    </div>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="xl:hidden w-8 h-8 rounded-full bg-white dark:bg-[#2a2d3a] shadow text-sm"
                    >
                    <FontAwesomeIcon icon={faXmark} className="dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(100vh-70px)]">
                    {chatHistory.map((chat, i) => (
                      <div key={chat.id} className="relative group">
                        <button
                          onClick={() => {
  setActiveHistory(i);
  setCurrentChatId(chat.id);

  const restored = chat.messages.map((m: any, idx: number) => {
    const base: any = { ...m, id: m.id ?? `${chat.id}-${idx}` };
    if (m.role === "report") {
      try {
        base.report = JSON.parse(m.text);
      } catch {
        base.report = null;
      }
    }
    return base;
  });

  setMessages(restored);

  // ✅ نرجّع الـ history الداخلي (نص فقط، من غير رسائل الريبورت) عشان يتبعت للباك إند
  contextRef.current = chat.messages
    .filter((m: any) => m.role !== "report")
    .map((m: any) => ({
      role: m.role,
      content: m.text,
    }));

  // ✅ لو المحادثة دي كانت فيها ريبورت، رجّعه كـ diagnosisContext عشان الموديل يفضل عارفه
  const reportMsg = chat.messages.find((m: any) => m.role === "report");
  diagnosisContextRef.current = reportMsg ? reportMsg.text : "";

  setShowHistory(false);
}}
                          className={`w-full flex items-start gap-3 px-4 py-3 pr-20 rounded-[50px] border text-left text-[0.8rem] leading-snug transition-all duration-150 ${
                            activeHistory === i
                              ? "bg-[#FFFFFF69] dark:bg-[#2a2d3a] border-[#a5cbee] dark:border-[#3f5f8f] text-[#1b6fc8] dark:text-[#6fa8dc] font-medium"
                              : "bg-[#f7fbff] dark:bg-[#20222c] border-[#e5eff8] dark:border-[#383c4d] text-slate-600 dark:text-gray-400 hover:bg-[#edf5ff] dark:hover:bg-[#2a2d3a] hover:border-[#b5d0ee] dark:hover:border-[#3f5f8f] hover:text-[#1b6fc8] dark:hover:text-[#6fa8dc]"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            className={`mt-[2px] flex-shrink-0 text-[0.85rem] transition-colors ${
                              activeHistory === i ? "text-[#1b6fc8] dark:text-[#6fa8dc]" : "text-[#85b8e0]"
                            }`}
                          />

                          {editingChatId === chat.id ? (
                            <div className="flex items-center gap-2 w-full">
                              <FontAwesomeIcon icon={faPen} className="text-[#1b6fc8] dark:text-[#6fa8dc]" />
                              <input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onBlur={() => {
                                  renameChat(chat.id, editedTitle);
                                  setEditingChatId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    renameChat(chat.id, editedTitle);
                                    setEditingChatId(null);
                                  }
                                }}
                                autoFocus
                                className="bg-transparent outline-none w-full text-[#1b6fc8] dark:text-[#6fa8dc]"
                              />
                            </div>
                          ) : (
                            <span className="truncate">{chat.title}</span>
                          )}
                        </button>

                        {/* ACTIONS */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingChatId(chat.id);
                              setEditedTitle(chat.title);
                            }}
                            className="text-[#1b6fc8] dark:text-[#6fa8dc] hover:scale-110 transition"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            className="text-red-500 hover:scale-110 transition"
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}