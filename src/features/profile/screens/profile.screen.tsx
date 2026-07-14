'use client'
import { useState, useEffect, useRef } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion, AnimatePresence } from "framer-motion";
import {
    faHome,
    faHeart,
    faShieldHalved,
    faCircleQuestion,
    faRightFromBracket,
    faChevronRight,
    faMagnifyingGlass,
    faStar,
    faExclamationCircle,
    faClock,
    faCamera,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import ProfileInfo from '../components/profileInfo'
import { uploadProfileImage, getProfile } from "../server/profile.actions";
import ChangePassword from '../components/changePassword'
import { useAppSelector } from "../../../store/store";
import { getSkinTestResult } from "../server/profile.actions";
import { useAppDispatch } from "../../../store/store";
import { logout } from "../../auth/store/auth.slice";
import { useRouter } from "next/navigation";
import { deleteToken } from "../../auth/server/auth.action";
import { getScanHistory } from "../../DermaScan/server/dermaScan.actions";

type TabType = 'skinProfile' | 'retakeSkin' | 'settings' | 'faqs'

const navItems = [
    { key: null, label: 'Home', icon: faHome, href: '/' },
    { key: 'skinProfile', label: 'My Skin Profile', icon: faHeart, href: null },
    { key: 'settings', label: 'Setting & Privacy', icon: faShieldHalved, href: null },
    { key: 'faqs', label: 'FAQs', icon: faCircleQuestion, href: null },
]

const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0 },
}

const fadeUpVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
}

const tabVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const staggerContainer = (stagger = 0.1, delay = 0) => ({
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

// ✅ استخراج أعلى نتيجة confidence من top3
function getTopResult(scan: any) {
    return scan?.result?.top3?.[0] ?? null;
}

function getScanDiseaseLabel(scan: any) {
    const top = getTopResult(scan);
    return top?.name_ar || top?.disease || "Unknown";
}

// ✅ إصلاح: بترجع رقم فقط بدون % عشان الـ UI يضيفها مرة واحدة
function getScanConfidenceValue(scan: any): number | null {
    const top = getTopResult(scan);
    return top?.confidence ?? null;
}

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('skinProfile')
    const [search, setSearch] = useState('')
    const [showPhotoMenu, setShowPhotoMenu] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [scanHistory, setScanHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true); // ✅ loading state

    useEffect(() => {
        // ✅ بيعمل refetch كل ما المستخدم يفتح تاب skinProfile
        if (activeTab !== 'skinProfile') return;

        const loadScanHistory = async () => {
            try {
                setHistoryLoading(true);
                const history = await getScanHistory();

                if (Array.isArray(history) && history.length > 0) {
                    const sorted = [...history].sort((a, b) => {
                        const dateA = new Date(a?.createdAt ?? 0).getTime();
                        const dateB = new Date(b?.createdAt ?? 0).getTime();
                        return dateB - dateA;
                    });
                    setScanHistory(sorted);
                } else {
                    setScanHistory([]);
                }
            } catch (error) {
                console.error("Failed to load scan history:", error);
                setScanHistory([]);
            } finally {
                setHistoryLoading(false);
            }
        };

        loadScanHistory();
    }, [activeTab]); // ✅ بيتنفذ كل ما activeTab يتغير لـ skinProfile

    const latestScan = scanHistory[0] ?? null;

    const { userInfo } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        await deleteToken();
        dispatch(logout());
        router.push("/login");
    };

    const [skinResult, setSkinResult] = useState<{
        skinTypeCode?: string;
        oD_Score?: number;
        sR_Score?: number;
        pN_Score?: number;
        wT_Score?: number;
        description?: string;
        strategy?: string;
        takenAt?: string;
    } | null>(null);

    const [profile, setProfile] = useState<{
        fullName?: string;
        email?: string;
        profileImage?: string | null;
        skinType?: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(
        userInfo?.profileImage || null
    );
    const [imageError, setImageError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleRemovePhoto = () => {
        setPreviewImage(null);
        setShowPhotoMenu(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const initials =
        (profile?.fullName || userInfo?.name)
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "U";

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const tempPreview = URL.createObjectURL(file);
        setImageError(false);
        setPreviewImage(tempPreview);
        setIsUploading(true);

        try {
            const response = await uploadProfileImage(file);
            if (response?.profileImage) {
                setPreviewImage(`${response.profileImage}?t=${Date.now()}`);
            }
            setProfile((prev) => ({
                ...prev,
                profileImage: response?.profileImage ?? prev?.profileImage,
                fullName: response?.fullName ?? prev?.fullName,
                skinType: response?.skinType ?? prev?.skinType,
            }));
        } catch (error) {
            console.log(error);
            alert("Failed to upload photo, please try again.");
            setPreviewImage(profile?.profileImage ?? userInfo?.profileImage ?? null);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const loadSkinType = async () => {
            try {
                const result = await getSkinTestResult();
                setSkinResult(result);
            } catch (error) {
                console.log(error);
            }
        };

        const loadProfile = async () => {
            try {
                const result = await getProfile();
                setProfile(result);
                if (result?.profileImage) {
                    setPreviewImage(`${result.profileImage}?t=${Date.now()}`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadSkinType();
        loadProfile();
    }, []);

    // ✅ Helper: عرض الـ confidence بشكل نظيف
    const renderConfidence = (scan: any) => {
        const val = getScanConfidenceValue(scan);
        if (val === null) return null;
        return `${val}%`;
    };

    // ✅ Helper: عرض التاريخ
    const formatDate = (dateStr: string | undefined, includeYear = false) => {
        if (!dateStr) return "--";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            ...(includeYear ? { year: "numeric" } : {}),
        });
    };

    return (
        <section className="min-h-screen bg-[#D5D5D6] dark:bg-[#1a1c24] flex flex-col lg:flex-row transition-colors duration-300">

            {/* ───────────── Blue Sidebar ───────────── */}
            <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="
                    lg:w-72 w-full shrink-0
                    bg-[#1687D6] dark:bg-[#0f5aa8]
                    shadow-[-6px_-6px_12px_#3FA4EB,6px_6px_12px_#1169A7]
                    dark:shadow-[-6px_-6px_12px_#1a6bb8,6px_6px_12px_#083152]
                    flex flex-col
                    lg:min-h-screen rounded-ee-[30] rounded-e-[30]
                "
            >
                {/* Profile Block */}
                <div className="flex flex-col items-center pt-10 pb-6 px-6 border-b border-white/20">
                    {/* Avatar */}
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                            className="relative w-28 h-28 mb-5 rounded-full overflow-hidden cursor-pointer bg-[#e6e4e3dc]
                                shadow-[-8px_-8px_16px_#4CB0F0,8px_8px_16px_#0D629D]"
                        >
                            {previewImage && !imageError ? (
                                <Image
                                    src={previewImage}
                                    alt={userInfo?.name || "User"}
                                    fill
                                    unoptimized
                                    className="object-cover rounded-full"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 text-[#692e04] text-2xl font-bold select-none">
                                    {initials}
                                </div>
                            )}
                        </motion.div>

                        <AnimatePresence>
                            {showPhotoMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="
                                        absolute top-full mt-3 left-1/2 -translate-x-1/2
                                        z-50 bg-[#E0E0E0] dark:bg-[#2a2d3a] rounded-2xl p-2
                                        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                                        dark:shadow-[8px_8px_16px_#1c1e27,-8px_-8px_16px_#383c4d]
                                        min-w-[180px]
                                    "
                                >
                                    <button
                                        onClick={() => { fileInputRef.current?.click(); setShowPhotoMenu(false); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition"
                                    >
                                        <FontAwesomeIcon icon={faCamera} className="text-[#0b116c] dark:text-[#8fb3e8] mr-1" />
                                        <span className='text-amber-950 dark:text-[#e0b088]'>Change Photo</span>
                                    </button>

                                    <button
                                        onClick={handleRemovePhoto}
                                        className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 mr-1" />
                                        <span>Remove Photo</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-white font-semibold text-lg tracking-wide"
                    >
                        {profile?.fullName || userInfo?.name}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 text-sm"
                    >
                        {profile?.email || userInfo?.email}
                    </motion.p>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mt-5 w-full relative"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                w-full pl-11 pr-4 py-3 rounded-2xl
                                bg-[#E0E0E0] dark:bg-[#2a2d3a]
                                shadow-[inset_3px_3px_6px_#c1c1c1,inset_-3px_-3px_6px_#ffffff]
                                dark:shadow-[inset_3px_3px_6px_#1c1e27,inset_-3px_-3px_6px_#383c4d]
                                placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-700 dark:text-gray-200 focus:outline-none
                            "
                        />
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={staggerContainer(0.12, 0.4)}
                        className="
                            mt-6 w-full grid grid-cols-3 rounded-2xl p-3
                            bg-[#E0E0E0] dark:bg-[#2a2d3a]
                            shadow-[inset_2px_2px_4px_#0D629D,inset_-2px_-2px_4px_#4CB0F0]
                        "
                    >
                        <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-2 px-2">
                            <FontAwesomeIcon icon={faStar} className="text-lg text-[#924b04] dark:text-[#d99a5b] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                            <span className="text-black dark:text-gray-200 text-[10px] text-center">Skin Type</span>
                            <span className="text-[#062f7f] dark:text-[#8fb3e8] font-bold text-sm">
                                {skinResult?.skinTypeCode || "N/A"}
                            </span>
                        </motion.div>

                        <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-2 px-2">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-lg text-[#924b04] dark:text-[#d99a5b] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                            <span className="text-black dark:text-gray-200 text-[10px] text-center leading-tight">Skin Concerns</span>
                            <span className="text-[#062f7f] dark:text-[#8fb3e8] font-bold text-[11px] text-center leading-tight">
                                {/* ✅ بيجيب أحدث scan */}
                                {historyLoading ? "..." : getScanDiseaseLabel(latestScan)}
                            </span>
                        </motion.div>

                        <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-2 px-2">
                            <FontAwesomeIcon icon={faClock} className="text-lg text-[#924b04] dark:text-[#d99a5b] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                            <span className="text-black dark:text-gray-200 text-[10px] text-center leading-tight">Last Test</span>
                            <span className="text-[#062f7f] dark:text-[#8fb3e8] font-bold text-[11px] text-center leading-tight">
                                {/* ✅ بيجيب تاريخ أحدث scan */}
                                {historyLoading ? "..." : formatDate(latestScan?.createdAt)}
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Nav Links */}
                <motion.nav
                    initial="hidden"
                    animate="show"
                    variants={staggerContainer(0.08, 0.5)}
                    className="flex-1 py-4 px-3 space-y-1"
                >
                    {navItems.map((item) => {
                        const isActive = item.key ? activeTab === item.key : false;
                        const classes = `
                            w-full flex items-center justify-between gap-3
                            px-4 py-3 rounded-xl transition-all duration-200 text-left
                            ${isActive ? 'bg-white/20 text-white shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                        `;
                        const inner = (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </span>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs opacity-60" />
                            </>
                        );
                        if (item.href) {
                            return (
                                <motion.div key={item.label} variants={itemVariants}>
                                    <Link href={item.href} className={classes}>{inner}</Link>
                                </motion.div>
                            );
                        }
                        return (
                            <motion.div key={item.label} variants={itemVariants}>
                                <button onClick={() => item.key && setActiveTab(item.key as TabType)} className={classes}>
                                    {inner}
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.nav>

                {/* Logout */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="px-3 pb-6">
                    <button onClick={handleLogout} className="
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        text-red-600 hover:bg-red-500/20 hover:text-red-200
                        transition-all duration-200 text-left text-sm font-medium
                    ">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                        Logout
                    </button>
                </motion.div>
            </motion.aside>

            {/* ───────────── Main Content ───────────── */}
            <main className="flex-1 min-w-0 p-6 lg:p-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'skinProfile' && (
                        <motion.div
                            key="skinProfile"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={tabVariants}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-[#491a02] dark:text-[#e0b088]">My Skin Profile</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your personalized skin analysis results</p>
                            </div>

                            {/* Skin Summary Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="
                                    rounded-3xl p-6
                                    bg-gradient-to-br from-[#1687D6]/70 via-[#1687D6] to-[#0C81E4]
                                    dark:from-[#0f5aa8]/70 dark:via-[#0f5aa8] dark:to-[#0a4d8f]
                                    shadow-[8px_8px_16px_#c8ced6,-8px_-8px_16px_#ffffff]
                                    dark:shadow-[8px_8px_16px_#0d0e12,-8px_-8px_16px_#2c2f3d]
                                "
                            >
                                <p className="text-[#d6d5d5] dark:text-gray-300 text-sm font-medium">Your Skin Type</p>
                                <h3 className="text-3xl font-bold text-[#ffffff] mt-2">
                                    {skinResult?.skinTypeCode || "Not Available"}
                                </h3>
                                <p className="mt-2 text-white/90 text-lg">{skinResult?.description}</p>
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9EEF5] dark:bg-[#20222c]
                                    shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff]
                                    dark:shadow-[inset_6px_6px_12px_#0d0e12,inset_-6px_-6px_12px_#2c2f3d]">
                                    <span className="text-[#031b3c] dark:text-gray-300 text-sm">Last Updated</span>
                                    <span className="font-semibold text-[#1687D6] dark:text-[#5a9fe8]">
                                        {formatDate(skinResult?.takenAt)}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Concerns & Recommendations */}
                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={staggerContainer(0.12, 0.2)}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <motion.div
                                    variants={fadeUpVariants}
                                    className="rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d] shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]"
                                >
                                    <p className="text-xs font-bold text-[#031b3c] dark:text-[#8fb3e8] uppercase mb-4">Main Concerns</p>
                                    <div className="rounded-2xl">
                                        <p className="text-slate-700 dark:text-gray-200 font-semibold">
                                            {historyLoading ? "Loading..." : getScanDiseaseLabel(latestScan)}
                                        </p>
                                        {/* ✅ إصلاح: بيعرض الـ confidence صح بدون %% */}
                                        {!historyLoading && renderConfidence(latestScan) && (
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                                                Confidence: {renderConfidence(latestScan)}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={fadeUpVariants}
                                    className="rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d] shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]"
                                >
                                    <p className="text-xs font-bold text-[#031b3c] dark:text-[#8fb3e8] uppercase mb-4">Recommended Routine</p>
                                    <div className="rounded-2xl">
                                        <p className="text-slate-600 dark:text-gray-300 text-sm leading-6">
                                            {skinResult?.strategy || "Complete a skin scan to get recommendations"}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* ✅ أحدث scan */}
                            {!historyLoading && latestScan && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.4 }}
                                    className="
                                        rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d]
                                        shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff]
                                        dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]
                                        flex items-center justify-between gap-4
                                    "
                                >
                                    <div>
                                        <p className="text-xs font-bold text-[#031b3c] dark:text-[#8fb3e8] uppercase mb-2">Latest Scan Result</p>
                                        <p className="text-slate-700 dark:text-gray-200 font-semibold">{getScanDiseaseLabel(latestScan)}</p>
                                        {/* ✅ إصلاح: confidence بدون %% */}
                                        {renderConfidence(latestScan) && (
                                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                                                Confidence: {renderConfidence(latestScan)}
                                            </p>
                                        )}
                                        {latestScan?.createdAt && (
                                            <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                                                {formatDate(latestScan.createdAt, true)}
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/scan-report/${latestScan.id}`}
                                        className="
                                            whitespace-nowrap px-5 py-2.5 rounded-xl
                                            text-white text-sm font-medium bg-[#1687D6] dark:bg-[#0f5aa8]
                                            shadow-[4px_4px_10px_#c8d0e7,-2px_-2px_8px_#1a99f0]
                                            hover:scale-105 transition
                                        "
                                    >
                                        View Report
                                    </Link>
                                </motion.div>
                            )}

                            {/* ✅ Scan History كاملة */}
                            {historyLoading ? (
                                <div className="rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d] shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]">
                                    <p className="text-sm text-slate-500 dark:text-gray-400">Loading scan history...</p>
                                </div>
                            ) : scanHistory.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d] shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]"
                                >
                                    <p className="text-xs font-bold text-[#031b3c] dark:text-[#8fb3e8] uppercase mb-4">
                                        Scan History ({scanHistory.length})
                                    </p>

                                    <div className="space-y-3">
                                        {scanHistory.map((scan) => (
                                            <div
                                                key={scan.id}
                                                className="
                                                    flex items-center justify-between gap-4
                                                    rounded-2xl px-4 py-3 bg-[#dfe5ec] dark:bg-[#20222c]
                                                    shadow-[inset_3px_3px_6px_#c8ced6,inset_-3px_-3px_6px_#ffffff]
                                                    dark:shadow-[inset_3px_3px_6px_#0d0e12,inset_-3px_-3px_6px_#2c2f3d]
                                                "
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-slate-700 dark:text-gray-200 font-semibold truncate">
                                                        {getScanDiseaseLabel(scan)}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        {scan?.createdAt && (
                                                            <span className="text-xs text-slate-500 dark:text-gray-400">
                                                                {formatDate(scan.createdAt, true)}
                                                            </span>
                                                        )}
                                                        {/* ✅ إصلاح: confidence بدون %% */}
                                                        {renderConfidence(scan) && (
                                                            <span className="text-xs text-slate-500 dark:text-gray-400">
                                                                {renderConfidence(scan)} confidence
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/scan-report/${scan.id}`}
                                                    className="
                                                        whitespace-nowrap px-4 py-2 rounded-xl
                                                        text-white text-xs font-medium bg-[#1687D6] dark:bg-[#0f5aa8]
                                                        shadow-[3px_3px_8px_#c8d0e7,-2px_-2px_6px_#1a99f0]
                                                        hover:scale-105 transition
                                                    "
                                                >
                                                    View Report
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="rounded-3xl p-5 bg-[#ecf0f89d] dark:bg-[#20222c9d] shadow-[6px_6px_12px_#d5dce5,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0d0e12,-6px_-6px_12px_#2c2f3d]">
                                    <p className="text-sm text-slate-500 dark:text-gray-400">No scan history found.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div
                            key="settings"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={tabVariants}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-[#491a02] dark:text-[#e0b088]">Setting & Privacy</h2>
                                <p className="text-[#6B7280] dark:text-gray-400 mt-2">Manage your account information and privacy</p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="rounded-[30px] p-6 bg-[#dfe5ec] dark:bg-[#20222c] shadow-[10px_10px_20px_#c8ced6,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#0d0e12,-10px_-10px_20px_#2c2f3d]"
                            >
                                <ProfileInfo />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="rounded-[30px] p-6 bg-[#dfe5ec] dark:bg-[#20222c] shadow-[10px_10px_20px_#c8ced6,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#0d0e12,-10px_-10px_20px_#2c2f3d]"
                            >
                                <ChangePassword />
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'faqs' && (
                        <motion.div
                            key="faqs"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={tabVariants}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-[#491a02] dark:text-[#e0b088]">FAQs</h2>
                                <p className="text-[#6B7280] dark:text-gray-400 mt-2">Common questions about DermaMind</p>
                            </div>

                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={staggerContainer(0.1, 0.1)}
                                className="space-y-4"
                            >
                                {[
                                    {
                                        q: 'How accurate is the skin analysis?',
                                        a: 'Our AI model is trained on thousands of dermatologist-reviewed cases for high accuracy.',
                                    },
                                    {
                                        q: 'How often should I retake the skin test?',
                                        a: 'We recommend retaking every 4–6 weeks as your skin changes with seasons and routines.',
                                    },
                                    {
                                        q: 'Is my skin data private?',
                                        a: 'Yes, your data is encrypted and never shared with third parties.',
                                    },
                                ].map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeUpVariants}
                                        className="rounded-[28px] p-6 bg-[#dfe5ec] dark:bg-[#20222c] shadow-[10px_10px_20px_#c8ced6,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#0d0e12,-10px_-10px_20px_#2c2f3d]"
                                    >
                                        <p className="font-bold text-[#1687D6] dark:text-[#5a9fe8] text-lg mb-3">{faq.q}</p>
                                        <div className="rounded-2xl px-5 py-4 bg-[#dfe5ec] dark:bg-[#20222c] text-[#64748b] dark:text-gray-300 shadow-[inset_4px_4px_8px_#c8ced6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0d0e12,inset_-4px_-4px_8px_#2c2f3d]">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </section>
    );
}