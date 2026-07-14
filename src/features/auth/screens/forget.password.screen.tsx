'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema } from "../schemas/forgetPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEnvelope, 
    faArrowLeft, 
    faShieldHalved, 
    faLock, 
    faCheckCircle,
    faSpinner,
    faKey,
    faUserShield,
    faClock
} from "@fortawesome/free-solid-svg-icons";
import forgetPassword from "../server/forgetPassword.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/src/assets/images/logo.png";
export default function ForgetPasswordScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            email: ''
        },
        resolver: zodResolver(forgetPasswordSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });


    const emailValue = watch('email');

    const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);

    try {
        const response = await forgetPassword(data.email);

        toast.success(response.message || 'Reset code sent to your email!');

        sessionStorage.setItem('resetEmail', data.email);

        setTimeout(() => {
            router.push('/verify-code');
        }, 2000);

    } catch (error: any) {
        console.log(error);
        console.log(error?.response);
        console.log(error?.response?.data);

        const errorMessage =
            error?.response?.data?.message ||
            'Failed to send reset code. Please try again.';

        toast.error(errorMessage);

    } finally {
        setIsLoading(false);
    }
};

    return (
        <section className=" bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen transition-colors duration-300">
                     <div className="flex flex-col items-center justify-center">
                         {/* Logo */}
                           <Image
               src={logo}
               alt="logo"
             className="w-[120px] mb-2 mt-10"
             />
    <h1 className="text-[#2C4A7F] dark:text-[#8fb3e8] font-bold text-3xl sm:text-4xl">
        Forget Password
      </h1>
                     </div>
                     

                <div className="flex relative items-center justify-center scale-[0.92] sm:scale-[0.95] md:scale-100">
                                      {/* Profile Image */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-[70px] h-[70px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] overflow-hidden flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)]">
                  <FontAwesomeIcon icon={faLock} className="text-[#1687D6] dark:text-[#5a9fe8] text-2xl"/>
                  </div>
              
              </div>
              
                        <div className="w-full">

    {/* نفس عرض الكارد */}
    <div className="max-w-[1000px] mx-auto">

        {/* Back Link */}
        <div className="mb-2  px-6 md:px-20">
            <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            >
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="text-sm group-hover:-translate-x-1 transition-transform" 
                />
                <span className="text-sm font-medium">Back to Sign In</span>
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
                                {!isEmailSent ? (
                                    <>
                                        {/* Header */}
                                        <div className="text-center mt-8">
                                            <p className="title text-white align-center font-bold text-2xl">
                                                 We’ll Send You an Email to Resat Your Password
                                            </p>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Email */}
                        <div className="flex flex-col items-center mb-4 relative">
                            <label htmlFor="email" className="w-full mt-4  max-w-[85%] text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                                Email
                            </label>
                           
                                                    <div className="absolute inset-y-0 top-13 left-12 pl-4 flex items-center pointer-events-none">
                                                        <FontAwesomeIcon 
                                                            icon={faEnvelope} 
                                                            className={`text-sm ${errors.email ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} 
                                                        />
                                                    </div>
                              <input
                                                        type="email"
                                                        id="email"
                                                        {...register("email")}
                                                        className={`w-full max-w-[90%]
                px-5 py-4 rounded-[25px] outline-none
                bg-[#D9D9D9] dark:bg-[#2a2d3a]
                shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF] dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
                  
                                                             pl-11 pr-4    focus:outline-none focus:bg-white dark:focus:bg-[#2a2d3a] transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                                                            errors.email 
                                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                                                : 'border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
                                                        }`}
                                                        placeholder="Enter your email address"
                                                    />
                                                
                                                {errors.email && (
                                                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                                        {errors.email.message}
                                                    </p>
                                                )}
                        </div>

                                            {/* Submit Button */}
                                            <div className="flex items-center flex-col">
                                                <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full sm:w-1/2 md:w-[30%]
              mt-4 py-3 rounded-[25px]
              bg-[#D9D9D9] dark:bg-[#2a2d3a]
              text-[#57300C] dark:text-[#d99a5b] font-bold
              text-base sm:text-lg
              shadow-[-2px_-2px_8px_#0C81E4,-2px_-2px_12px_rgba(255,255,255,0.382),inset_2px_2px_4px_rgba(255,255,255,0.504),2px_2px_8px_rgba(0,0,0,0.689)]
              dark:shadow-[-2px_-2px_8px_rgba(12,129,228,0.3),-2px_-2px_12px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.6)]
              hover:scale-[0.98]
              hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#dcdddf]
              dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
              transition
                 "
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faEnvelope} className="px-2" />
                                                        <span>Send Reset Link</span>
                                                    </>
                                                )}
                                            </button>
                                            </div>

                                        </form>

                                        {/* Divider */}
                                        {/* <div className="relative my-8">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-ful"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="px-4 text-sm text-white">OR</span>
                                            </div>
                                        </div> */}

                                        {/* Alternative Options */}
                                        <div className="space-y-3 ">
                                            {/* <Link 
                                                href="/login"
                                                className="w-full sm:w-1/2 md:w-[30%]
              mt-4 py-3 rounded-[25px]
              bg-[#D9D9D9]
              text-[#57300C] font-bold
              text-base sm:text-lg
              shadow-[-2px_-2px_8px_#0C81E4,-2px_-2px_12px_rgba(255,255,255,0.382),inset_2px_2px_4px_rgba(255,255,255,0.504),2px_2px_8px_rgba(0,0,0,0.689)]
              hover:scale-[0.98]
              hover:shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#dcdddf]
              transition"
                                            >
                                                <div className="flex items-center flex-col">
                                                    <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                                                <span >Return to Sign In</span>
                                                </div>
                                            </Link> */}
                                            <p className="text-center text-sm text-white mt-5">
                                                Don't have an account?{' '}
                                            <Link href="/signup" className="text-[#57300C] dark:text-[#e0b088] font-semibold hover:text-[#fffdfb] dark:hover:text-white transition-colors">
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    /* Success State */
                                    <div className="text-center py-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 animate-pulse">
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-4xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                            Check Your Email
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                                            We've sent a password reset link to
                                        </p>
                                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-6">
                                            {emailValue}
                                        </p>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-6">
                                            <p className="text-amber-700 dark:text-amber-400 text-sm">
                                                <span className="font-semibold">Tip:</span> If you don't see the email, check your spam folder or request a new link.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsEmailSent(false)}
                                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                                            Try another email
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Security Note */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs ">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <span>Your information is secure and encrypted</span>
                            </div>
        </div>

    </div>

</div>
            
        </section>
    );
}