"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUserPlus, faEnvelope, faLock, faPhone, faUser, faEye, faEyeSlash, faLeaf, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema, SignupSchemaType } from "../../schemas/signupschema";
import { SignupAction } from "../../server/signup.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import logo from "../../../../assets/images/logo.png";
import { faFacebookF, faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function SignupForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const [isCreated, setIsCreated] = useState(false)
    const icons = [faGoogle];
    const [profileImage, setProfileImage] = useState<string | null>(null);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setProfileImage(imageURL);
        }
    }

    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<SignupSchemaType>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            profileImage: undefined,
            terms: false
        },
        resolver: zodResolver(SignupSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const onSubmit: SubmitHandler<SignupSchemaType> = async (values) => {
        const response = await SignupAction(values)
        if (response?.success) {
            reset()
            toast.success("Your account has been created successfully. Redirecting to sign in...");
            setIsCreated(true)
            setTimeout(() => {
                router.push('/login')
            }, 1200)
            return
        } else {
            if (response?.message) {
                toast.error(response.message);
            }
            if (response?.errors) {
                const errors = response.errors;
                Object.keys(errors).forEach((key) => {
                    setError(key as keyof SignupSchemaType, {
                        message: errors[key as keyof typeof errors],
                    });
                });
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen transition-colors duration-300">
            {/* Logo */}
            <Image src={logo} alt="logo" className="w-[120px] mb-2" />
            <h1 className="text-[#2C4A7F] dark:text-[#8fb3e8] font-bold text-3xl sm:text-4xl mb-4 lg:mb-0">DermaMind</h1>
            <span className="hidden lg:block text-sm sm:text-[16px] font-bold bg-gradient-to-b from-[#B8753B] to-[#57300C] dark:from-[#e0b088] dark:to-[#d99a5b] bg-clip-text text-transparent pb-2">
                Where AI Meets Skin Health
            </span>

            <div className="w-full">
                <div className="w-full px-4 md:px-16 lg:px-24 mb-10">

                    {/* ====== CARD ====== */}
                    <div className="
                        relative
                        mt-10 w-full mx-auto max-w-[1000px] min-h-[380px]
                        rounded-[50px] sm:rounded-[70px] md:rounded-[100px]
                        px-6 md:px-12 py-8
                        bg-gradient-to-b from-[#3B6CB8] via-[#1687D6] to-[#0C81E4]
                        dark:from-[#2a4a7a] dark:via-[#1483DA] dark:to-[#0C6BC0]
                        shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.6),inset_2px_2px_4px_rgba(255,255,255,0.2),2px_2px_8px_rgba(0,0,0,0.25)]
                        dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.08),2px_2px_8px_rgba(0,0,0,0.5)]
                    ">
                        {/* Profile Image - بتظهر دايماً فوق الكارد */}
                        {!isCreated && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("profileImage")}
                                        onChange={(e) => {
                                            register("profileImage").onChange(e);
                                            handleImageUpload(e);
                                        }}
                                    />
                                    <div className="w-[80px] h-[80px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] overflow-hidden flex items-center justify-center
                                        shadow-[-2px_-2px_8px_rgba(255,255,255,1),2px_2px_8px_rgba(0,0,0,0.3)]
                                        dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)]">
                                        {profileImage ? (
                                            <div className="relative w-full h-full">
                                                <Image src={profileImage} alt="profile" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <FontAwesomeIcon icon={faUser} className="text-[#1687D6] dark:text-[#5a9fe8] text-3xl" />
                                        )}
                                    </div>
                                </label>
                            </div>
                        )}

                        {isCreated ? (
                            /* ====== SUCCESS STATE جوا الكارد ====== */
                            <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
                                {/* Check Circle */}
                                <div className="
                                    w-24 h-24 rounded-full
                                    flex items-center justify-center
                                    bg-white dark:bg-[#20222c]
                                    shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.9)]
                                    dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                ">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#1687D6] dark:text-[#5a9fe8] text-5xl" />
                                </div>

                                <h3 className="text-3xl font-bold text-white">
                                    Success
                                </h3>

                                <p className="text-white/80 text-center">
                                    Your account has been successfully registered
                                </p>

                                <button
                                    onClick={() => router.push("/login")}
                                    className="
                                        mt-4 px-10 py-3 rounded-[25px]
                                        bg-[#D9D9D9] dark:bg-[#2a2d3a] text-[#57300C] dark:text-[#d99a5b] font-bold text-lg
                                        shadow-[-2px_-2px_8px_#0C81E4,-2px_-2px_12px_rgba(255,255,255,0.382),inset_2px_2px_4px_rgba(255,255,255,0.504),2px_2px_8px_rgba(0,0,0,0.689)]
                                        dark:shadow-[-2px_-2px_8px_rgba(12,129,228,0.3),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.6)]
                                        hover:scale-[0.98] transition
                                    "
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            /* ====== FORM STATE ====== */
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* Full Name */}
                                <div className="flex flex-col items-center mb-4">
                                    <label htmlFor="name" className="w-full max-w-[85%] text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        id="name"
                                        className={`w-full max-w-[90%] px-5 py-4 rounded-[25px]
                                        bg-[#D9D9D9] dark:bg-[#2a2d3a] outline-none dark:text-gray-100
                                        shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                        dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                        ${errors.name ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'}`}
                                        {...register('name')}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name.message}</p>}
                                </div>

                                {/* Email */}
                                <div className="flex flex-col items-center mb-4">
                                    <label htmlFor="email" className="w-full max-w-[85%] text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        id="email"
                                        className={`w-full max-w-[90%] px-5 py-4 rounded-[25px]
                                        bg-[#D9D9D9] dark:bg-[#2a2d3a] outline-none dark:text-gray-100
                                        shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                        dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                        ${errors.email ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'}`}
                                        {...register('email')}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email.message}</p>}
                                </div>

                                {/* Password */}
                                <div className="flex flex-col relative mb-2">
                                    <label htmlFor="password" className="w-full max-w-[85%] mx-auto text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                                        Password
                                    </label>
                                    <div className="w-full flex justify-center">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            id="password"
                                            className={`w-full max-w-[90%] px-5 py-4 rounded-[25px] outline-none
                                            bg-[#D9D9D9] dark:bg-[#2a2d3a] dark:text-gray-100
                                            shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                            ${errors.password ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'}`}
                                            {...register('password')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-[60%] -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 pr-12"
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {errors.password ? (
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.password.message}</p>
                                    ) : (
                                        <p className="text-xs text-white/60 flex justify-between items-center max-w-[90%] mx-auto mt-1">Must be at least 8 characters</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col relative">
                                    <label htmlFor="repassword" className="w-full max-w-[85%] mx-auto text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="w-full flex justify-center">
                                        <input
                                            type={showRePassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            id="repassword"
                                            className={`w-full max-w-[90%] px-5 py-4 rounded-[25px] outline-none
                                            bg-[#D9D9D9] dark:bg-[#2a2d3a] dark:text-gray-100
                                            shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                            ${errors.rePassword ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'}`}
                                            {...register('rePassword')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRePassword(!showRePassword)}
                                            className="absolute right-5 top-[70%] -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 pr-12"
                                        >
                                            <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {errors.rePassword && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.rePassword.message}</p>}
                                </div>

                                {/* Terms */}
                                <div className="flex items-center justify-between max-w-[90%] mx-auto">
                                    <div className="flex items-center gap-2 mt-5">
                                        <input
                                            id="terms"
                                            type='checkbox'
                                            className="h-4 w-4 rounded border-white text-emerald-600 focus:ring-emerald-500"
                                            {...register('terms')}
                                        />
                                        <label htmlFor="terms" className="text-sm text-white">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-[#4c1f08] dark:text-[#e0b088] hover:text-[#9b3a0a] dark:hover:text-[#d99a5b] font-medium transition-all duration-300 hover:underline hover:underline-offset-2">
                                                Terms of Service
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/privacy-policy" className="text-[#4c1f08] dark:text-[#e0b088] hover:text-[#9b3a0a] dark:hover:text-[#d99a5b] font-medium transition-all duration-300 hover:underline hover:underline-offset-2">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center flex-col">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-1/2 md:w-[30%]
                                        mt-5 py-3 bg-[#D9D9D9] dark:bg-[#2a2d3a] text-[#57300C] dark:text-[#d99a5b] font-bold rounded-[25px]
                                        text-base sm:text-lg
                                        shadow-[-2px_-2px_8px_#0C81E4,-2px_-2px_12px_rgba(255,255,255,0.382),inset_2px_2px_4px_rgba(255,255,255,0.504),2px_2px_8px_rgba(0,0,0,0.689)]
                                        dark:shadow-[-2px_-2px_8px_rgba(12,129,228,0.3),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.6)]
                                        hover:scale-[0.98]
                                        hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#dcdddf]
                                        dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                        transition"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                                                <span>Create Account</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer links - بتظهر بره الكارد بس لما مش success */}
                    {!isCreated && (
                        <>
                            <p className="text-center sm:text-[16px] text-sm bg-gradient-to-b from-[#B8753B] to-[#57300C] dark:from-[#e0b088] dark:to-[#d99a5b] bg-clip-text text-transparent pt-4">
                                Already have an account?{' '}
                                <Link href="/login" className="text-[#1687D6] dark:text-[#5a9fe8] hover:text-[#9b3a0a] dark:hover:text-[#e0b088] font-semibold transition-all duration-300 hover:underline hover:underline-offset-2">
                                    Sign in
                                </Link>
                            </p>

                            {/* OR */}
                            <div className="text-center my-3">
                                <span className="block text-[#573006] dark:text-[#d99a5b] text-sm font-bold mb-2">OR</span>
                                <div className="flex gap-4 justify-center">
                                    {icons.map((icon, i) => (
                                        <div key={i} className="w-10 h-10 sm:w-11 sm:h-11 md:w-[45px] md:h-[45px]
                                            rounded-full flex items-center justify-center
                                            text-[#1687D6] dark:text-[#5a9fe8] text-lg
                                            bg-[#D5D5D6] dark:bg-[#242732]
                                            shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),2px_2px_8px_rgba(0,0,0,0.3)]
                                            dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)]
                                            hover:scale-110
                                            hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF]
                                            dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                                            transition cursor-pointer">
                                            <FontAwesomeIcon icon={icon} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}