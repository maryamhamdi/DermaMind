import React from "react";
import Link from "next/link";
import PolicyCard from "./PolicyCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faRotate, faShieldHalved, faHeadset, faShield, faLock, faUndo, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ARTICLES = [
  {
    article: "ARTICLE 1",
    title: "Information We Collect",
    bullets: [
      { text: "Personal Data: Name, email address, and account credentials." },
      { text: "Skin Assessment Data: Answers provided during skin analysis tests, skin concerns, and skincare goals." },
      { text: "Usage Information: Pages visited, features used, and interaction with recommendations." },
      { text: "Technical Information: Device type, browser information, IP address, and access timestamps." },
    ],
  },
  {
    article: "ARTICLE 2",
    title: "How We Use Your Information",
    bullets: [
      { text: "To provide personalized skincare recommendations." },
      { text: "To analyze your skin assessment results." },
      { text: "To improve the accuracy of our AI-powered skincare insights." },
      { text: "To communicate important account updates." },
      { text: "To enhance the user experience and platform performance." },
    ],
  },
  {
    article: "ARTICLE 3",
    title: "Data Protection",
    bullets: [
      { text: "All personal information is protected using industry-standard security measures." },
      { text: "Data transmissions are encrypted using SSL/TLS technology." },
      { text: "Access to user data is limited to authorized personnel." },
      { text: "Regular security reviews are conducted to maintain data safety." },
    ],
  },
  {
    article: "ARTICLE 4",
    title: "Information Sharing",
    bullets: [
      { text: "We do not sell your personal information." },
      { text: "Information may be shared with trusted service providers supporting platform operations." },
      { text: "Data may be disclosed when required by applicable laws or regulations." },
    ],
  },
  {
    article: "ARTICLE 5",
    title: "Your Rights",
    bullets: [
      { text: "Access: Access your personal information." },
      { text: "Rectification: Update or correct your account details." },
      { text: "Erasure: Request deletion of your account and associated data." },
      { text: "Portability: Withdraw consent for optional communications." },
      { text: "Opt-out: Request a copy of your stored information." },
    ],
  },
  {
    article: "ARTICLE 6",
    title: "Cookies",
    bullets: [
      { text: "Cookies help us improve website functionality and user experience." },
      { text: "Analytics tools may be used to understand platform usage." },
      { text: "Users can manage cookie preferences through browser settings." },
    ],
  },
  {
    article: "ARTICLE 7",
    title: "Data Retention",
    bullets: [
      { text: "Personal and skin assessment data are retained only as long as necessary." },
      { text: "Users may request account deletion at any time." },
      { text: "Deleted account data will be removed according to applicable retention policies." },
    ],
  },
  {
    article: "ARTICLE 8",
    title: "Medical Disclaimer",
    bullets: [
      { text: "DermaMind provides skincare guidance and recommendations for informational purposes only." },
      { text: "The platform does not replace professional medical advice, diagnosis, or treatment." },
      { text: "Users should consult a dermatologist for serious skin conditions." },
    ],
  },
  {
    article: "ARTICLE 8",
    title: "Contact Us",
    bullets: [
      { text: "If you have questions regarding this Privacy Policy or your personal data, please contact us at:dermamindteam@gmail.com" },
    ],
  },
];

export default function PrivacyScreen() {
  return (
    <>
      <div className="w-full bg-[#033073] text-white py-8 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faShield} />
            </div>
            <div>
              <nav className="text-sm text-white/90 mb-1">
                <Link href="/" className="opacity-90 hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <span className="font-semibold">Privacy Policy</span>
              </nav>
              <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
              <p className="text-sm mt-1 opacity-90">Last updated: June 2026</p>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <div className=" border border-emerald-100 rounded-lg p-4 flex items-start gap-4 bg-[#EAF4FF] transition-all
duration-300
hover:-translate-y-1
shadow-[-4px_-4px_8px_rgba(255,255,255,0.8),4px_4px_8px_rgba(174,190,205,0.15)]">
            <div className="h-10 w-10 rounded-lg bg-[#071d98] flex items-center justify-center text-white ">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div>
              <div className="font-semibold text-gray-800">Your Privacy Matters</div>
              <div className="text-sm text-gray-600">This Privacy Policy describes how DermaMind collects, uses, and protects your personal information when you use our services. We are committed to ensuring that your privacy is protected.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {ARTICLES.map((a) => (
            <PolicyCard key={a.article} article={a.article} title={a.title} bullets={a.bullets} icon={<FontAwesomeIcon icon={faShieldHalved} />} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="inline-block text-sm text-gray-600 hover:underline">← Back to Home</Link>
          <Link href="/terms" className="inline-block bg-[#2337b7] text-white px-5 py-2 rounded-full hover:bg-[#071d98] transition">View Terms of Service →</Link>
        </div>

      </section>
    </>
  );
}

