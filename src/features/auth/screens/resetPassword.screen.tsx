'use client'
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowLeft, 
    faShieldHalved, 
    faLock, 
    faCheckCircle,
    faSpinner,
    faKey,
    faEye,
    faEyeSlash,
    faUnlockKeyhole,
    faCircleCheck,
    faLockOpen
} from "@fortawesome/free-solid-svg-icons";
import { resetPassword } from "../server/forgetPassword.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { resetPasswordSchema, ResetPasswordFormData } from "../schemas/resetPasswordSchema";
import Image from "next/image";
import logo from "@/src/assets/images/logo.png";
export default function ResetPasswordScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get email from sessionStorage
        const storedEmail = sessionStorage.getItem('resetEmail');
        if (!storedEmail) {
            toast.error('Please start the password reset process from the beginning');
            router.push('/forget-password');
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>({
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        },
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    const passwordValue = watch('newPassword');

    // Password strength checker
    const getPasswordStrength = () => {
        if (!passwordValue) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (passwordValue.length >= 8) strength++;
        if (/[a-z]/.test(passwordValue)) strength++;
        if (/[A-Z]/.test(passwordValue)) strength++;
        if (/[0-9]/.test(passwordValue)) strength++;
        if (/[!@#$%^&*()\[\]{}\-_+=~`|:;"'<>,./?]/.test(passwordValue)) strength++;

        if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength: 2, label: 'Fair', color: 'bg-amber-500' };
        if (strength <= 4) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
        return { strength: 4, label: 'Strong', color: 'bg-emerald-500' };
    };

    const passwordStrength = getPasswordStrength();

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email) {
            toast.error('Email not found. Please restart the process.');
            router.push('/forget-password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPassword(email, data.newPassword);
            toast.success(response.message || 'Password reset successfully!');
            setIsSuccess(true);
            // Clear sessionStorage
            sessionStorage.removeItem('resetEmail');
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to reset password. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className=" gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
  <div className="flex flex-col items-center justify-center">
                         {/* Logo */}
                           <Image
               src={logo}
               alt="logo"
             className="w-[120px] mb-2 mt-10"
             />
    <h1 className="text-[#2C4A7F] dark:text-[#8fb3e8] font-bold text-3xl sm:text-4xl">
       Reset Password
      </h1>
                     </div>
<div className="flex relative items-center justify-center scale-[0.92] sm:scale-[0.95] md:scale-100">
                                      {/* Profile Image */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-[70px] h-[70px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] overflow-hidden flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)]">
                  <FontAwesomeIcon icon={faLockOpen} className="text-[#1687D6] dark:text-[#5a9fe8] text-2xl"/>
                  </div>
              
              </div>

                    {/* Right Side - Form Section */}
                    <div className="w-full">
                        <div className="max-w-[1000px] mx-auto">
                             <div className="mb-2 px-6 md:px-20">
            <Link 
                href="/verify-code" 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            >
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="text-sm group-hover:-translate-x-1 transition-transform" 
                />
                <span className="text-sm font-medium">Back to Verify Code</span>
            </Link>
        </div>

                            {/* Card */}
                            <div className="w-full 
            rounded-[50px] sm:rounded-[70px] md:rounded-[100px]
            px-6 md:px-12 py-8
            bg-gradient-to-b from-[#3B6CB8] via-[#1687D6] to-[#0C81E4]
            dark:from-[#2a4a7a] dark:via-[#1483DA] dark:to-[#0C6BC0]
            shadow-[-2px_-2px_8px_rgba(255,255,255,1),-2px_-2px_12px_rgba(255,255,255,0.6),inset_2px_2px_4px_rgba(255,255,255,0.2),2px_2px_8px_rgba(0,0,0,0.25)]
            dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.08),2px_2px_8px_rgba(0,0,0,0.5)]
        ">
                                {!isSuccess ? (
                                    <>
                                        {/* Header */}
                                        <div className="text-center mb-8">                                            
                                            {email && (
                                                <p className="text-[#05e946] text-sm mt-5 font-medium">
                                                    {email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                            {/* New Password Field */}
                                            <div>
                                                <label 
                                                    htmlFor="newPassword" 
                                                    className="block text-white text-lg sm:text-[20px] font-semibold mb-2"
                                                >
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <FontAwesomeIcon 
                                                            icon={faLock} 
                                                            className={`text-sm ${errors.newPassword ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} 
                                                        />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="newPassword"
                                                        {...register("newPassword")}
                                                        className={`w-full pl-11 pr-12 py-3.5 focus:outline-none focus:bg-white dark:focus:bg-[#2a2d3a] transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-[25px] outline-none
                bg-[#D9D9D9] dark:bg-[#2a2d3a]
                shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF] dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)] ${
                                                            errors.newPassword 
                                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                                                : 'border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
                                                        }`}
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                                    >
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </button>
                                                </div>
                                                
                                                {/* Password Strength Indicator */}
                                                {passwordValue && (
                                                    <div className="mt-3">
                                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                                            <span className="text-[#491e03] dark:text-[#d99a5b]">Password Strength</span>
                                                            <span className={`font-medium ${
                                                                passwordStrength.strength === 1 ? 'text-red-500' :
                                                                passwordStrength.strength === 2 ? 'text-amber-500' :
                                                                passwordStrength.strength === 3 ? 'text-blue-500' :
                                                                'text-[#491e03] dark:text-[#d99a5b]'
                                                            }`}>
                                                                {passwordStrength.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4].map((level) => (
                                                                <div 
                                                                    key={level}
                                                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                                                        level <= passwordStrength.strength 
                                                                            ? passwordStrength.color 
                                                                            : 'bg-gray-200 dark:bg-gray-600/40'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {errors.newPassword && (
                                                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                                        {errors.newPassword.message}
                                                    </p>
                                                )}
                                            </div>


                                            {/* Confirm Password Field */}
                                            <div>
                                                <label 
                                                    htmlFor="confirmPassword" 
                                                    className="block text-white text-lg sm:text-[20px] font-semibold mb-2"
                                                >
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <FontAwesomeIcon 
                                                            icon={faLock} 
                                                            className={`text-sm ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} 
                                                        />
                                                    </div>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        {...register("confirmPassword")}
                                                        className={`w-full pl-11 pr-12 py-3.5  focus:outline-none focus:bg-white dark:focus:bg-[#2a2d3a] transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-[25px] outline-none
                bg-[#D9D9D9] dark:bg-[#2a2d3a]
                shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF] dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)] ${
                                                            errors.confirmPassword 
                                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                                                : 'border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
                                                        }`}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                                    >
                                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                                        {errors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className=" mx-auto
flex
items-center
justify-center 
bg-[#E0E0E0] dark:bg-[#2a2d3a]
text-[#6B3E14] dark:text-[#d99a5b]
font-bold
w-[220px]
h-[55px]
rounded-full
shadow-[-2px_-2px_8px_#0C81E4,-2px_-2px_12px_rgba(255,255,255,0.382),inset_2px_2px_4px_rgba(255,255,255,0.504),2px_2px_8px_rgba(0,0,0,0.689)]
dark:shadow-[-2px_-2px_8px_rgba(12,129,228,0.3),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.6)]
              hover:scale-[0.98]
              hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#dcdddf]
              dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
              transition
hover:scale-105 py-3.5 px-6  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                        <span>Resetting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faKey} />
                                                        <span>Reset Password</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                      
                                    </>
                                ) : (
                                    /* Success State */
                                    <div className="text-center py-6">
                                        <h2 className="text-2xl font-bold text-white mb-3">
                                            Password Reset Successfully!
                                        </h2>
                                        <div className="w-20 h-20 bg-[#E0E0E0] dark:bg-[#2a2d3a] shadow-[-2px_-2px_8px_rgba(255,255,255,1),2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-4xl" />
                                        </div>
                                        <p className="text-white mb-6">
                                            Your password has been updated. You can now sign in with your new password.
                                        </p>
                                        <p className="text-white font-medium">
                                            Redirecting to login...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Security Note */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <span>Your password is encrypted and secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}