import React from "react";
import Link from "next/link";
import PolicyCard from "./PolicyCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faExclamationTriangle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const ARTICLES = [
  {
    article: "ARTICLE 1",
    title: "Acceptance of Terms",
    bullets: [
      { text: "By accessing DermaMind, you agree to comply with these Terms of Service." },
      { text: "If you do not agree with any part of these terms, please discontinue using the platform." },
      { text: "DermaMind reserves the right to update these terms at any time." },
    ],
  },
  {
    article: "ARTICLE 2",
    title: "User Accounts",
    bullets: [
      { text: "Users are responsible for maintaining the confidentiality of their account credentials." },
      { text: "All information provided during registration must be accurate and up to date." },
      { text: "Users are responsible for all activities performed under their accounts." },
    ],
  },
  {
    article: "ARTICLE 3",
    title: "Skin Analysis Service",
    bullets: [
      { text: "DermaMind provides AI-powered skin analysis and skincare recommendations." },
      { text: "Analysis results are generated based on user-provided information and assessments." },
      { text: "Results should be used as guidance and not as a substitute for professional medical advice." },
    ],
  },
  {
    article: "ARTICLE 4",
    title: "Medical Disclaimer",
    bullets: [
      { text: "DermaMind is not a medical diagnosis platform." },
      { text: "Recommendations provided are for informational and educational purposes only." },
      { text: "Users should consult a licensed dermatologist for serious skin concerns." },
    ],
  },
  {
    article: "ARTICLE 5",
    title: "Product Recommendations",
    bullets: [
      { text: "Recommended products are suggested based on skin analysis results." },
      { text: "DermaMind does not guarantee specific skincare outcomes." },
      { text: "Users should review product ingredients before use." },
    ],
  },
  {
    article: "ARTICLE 6",
    title: "User Responsibilities",
    bullets: [
      { text: "Users agree not to misuse the platform or attempt unauthorized access." },
      { text: "False, misleading, or harmful information must not be submitted." },
      { text: "Users are responsible for decisions made based on platform recommendations." },
    ],
  },
  {
    article: "ARTICLE 7",
    title: "Limitation of Liability",
    bullets: [
      { text: "DermaMind shall not be liable for any damages resulting from the use of the platform." },
      { text: "The platform is provided on an 'as available' basis without warranties of any kind." },
    ],
  },
  {
    article: "ARTICLE 8",
    title: "Privacy & Data Usage",
    bullets: [
      { text: "User data is handled according to our Privacy Policy." },
      { text: "Skin assessment information is used to improve recommendation accuracy." },
    ],
  },
  {
    article: "ARTICLE 9",
    title: "Contact Us",
    bullets: [
      { text: "For questions regarding these Terms, contact us at dermamindteam@gmail.com" },
    ],
  },
];

export default function TermsScreen() {
  return <>
      <div className="w-full bg-[#033073] dark:bg-[#0a1f42] text-white py-8 shadow-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faFileLines} />
            </div>
            <div>
              <nav className="text-sm text-white/90 mb-1">
                <Link href="/" className="opacity-90 hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <span className="font-semibold">Terms of Service</span>
              </nav>
              <h1 className="text-3xl font-extrabold">Terms of Service</h1>
              <p className="text-sm mt-1 opacity-90">Last updated: June 2026</p>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto py-8 px-4 bg-[#D5D5D6] dark:bg-[#1a1c24] transition-colors duration-300">

      <div className="mb-6">
        <div className="border border-yellow-200 dark:border-transparent rounded-lg p-4 flex items-start gap-4 bg-[#EAF4FF] dark:bg-[#20222c] transition-all
duration-300
hover:-translate-y-1
shadow-[-4px_-4px_8px_rgba(255,255,255,0.8),4px_4px_8px_rgba(174,190,205,0.15)]
dark:shadow-[-4px_-4px_8px_rgba(255,255,255,0.04),4px_4px_8px_rgba(0,0,0,0.4)]">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-[#071d98] dark:bg-[#2d4fc9] text-white shrink-0"><FontAwesomeIcon icon={faExclamationTriangle} /></div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-100">Important Notice</div>
<div className="text-sm text-gray-600 dark:text-gray-300">
  By accessing and using DermaMind, you agree to be bound by these Terms and Conditions. These terms govern your use of our AI-powered skin analysis platform, personalized skincare recommendations, and related services.
</div>          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {ARTICLES.map((a) => (
          <PolicyCard
            key={a.article}
            article={a.article}
            title={a.title}
            bullets={a.bullets}
            icon={<FontAwesomeIcon icon={faCheck} className="text-[#031e95] dark:text-[#7d9dff]" />}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link href="/" className="inline-block text-sm text-gray-600 dark:text-gray-400 hover:underline">← Back to Home</Link>
        <Link href="/privacy-policy" className="inline-block bg-[#2337b7] dark:bg-[#2d4fc9] text-white px-5 py-2 rounded-full hover:bg-[#071d98] dark:hover:bg-[#243db8] transition">View Privacy Policy →</Link>
      </div>

     
      </section>
    </>
}