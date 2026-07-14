'use client'

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowLeft, 
    faShieldHalved, 
    faLock, 
    faCheckCircle,
    faSpinner,
    faKey,
    faEnvelopeOpenText,
    faRotateRight,
    faCircleCheck,
    faCheck,
    faEnvelope,
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import { verfiyRestCode } from "../server/forgetPassword.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/src/assets/images/logo.png";
export default function VerifyForgetPasswordScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0 && !canResend) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
    }, [resendTimer, canResend]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take the last character
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newCode[index] = char;
        });
        setCode(newCode);
        // Focus the next empty input or the last one
        const nextEmptyIndex = newCode.findIndex(c => c === '');
        inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus();
    };

    const handleResend = () => {
        setResendTimer(60);
        setCanResend(false);
        toast.info('Reset code has been resent to your email');
        // You can call the forgetPassword action here again if needed
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resetCode = code.join('');
        
        if (resetCode.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const response = await verfiyRestCode(resetCode);
            toast.success(response.message || 'Code verified successfully!');
            setIsVerified(true);
            // Redirect to reset password page after a short delay
            setTimeout(() => {
                router.push('/reset-password');
            }, 1500);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Invalid code. Please try again.';
            toast.error(errorMessage);
            // Clear the code on error
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
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
       Check Your Email
      </h1>
                     </div>
                <div className="flex relative items-center justify-center scale-[0.92] sm:scale-[0.95] md:scale-100">
                                      {/* Profile Image */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-[70px] h-[70px] rounded-full bg-[#E0E0E0] dark:bg-[#2a2d3a] overflow-hidden flex items-center justify-center shadow-[-2px_-2px_8px_rgba(255,255,255,1),2px_2px_8px_rgba(0,0,0,0.3)] dark:shadow-[-2px_-2px_8px_rgba(255,255,255,0.05),2px_2px_8px_rgba(0,0,0,0.5)]">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[#1687D6] dark:text-[#5a9fe8] text-2xl"/>
                  </div>
              
              </div>
              
                        <div className="w-full">

    {/* نفس عرض الكارد */}
    <div className="max-w-[1000px] mx-auto">

        {/* Back Link */}
        <div className="mb-2  px-6 md:px-20">
            <Link 
                href="/forget-password" 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            >
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="text-sm group-hover:-translate-x-1 transition-transform" 
                />
                <span className="text-sm font-medium">Back to Forget Password</span>
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
                               
                                    <>
                                     <div className="text-center mt-8 mb-8">

    <p className="text-white mt-3  font-semibold text-lg">
       We’ve Send an Email to the address 
    </p>

    <p className="text-white font-semibold mt-2">
        ***********@gmail.com
    </p>
</div>
                                      
<div className="flex items-center justify-center">
                        <div className="w-full max-w-md">

                            {/* Card */}
                                {!isVerified ? (
                                    <>
                                

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="w-full flex justify-center">
  <div className="w-fit">

    <p className="text-white text-lg font-medium mb-3">
      Enter code
    </p>

    <div
      className="flex gap-7 sm:gap-8"
      onPaste={handlePaste}
    >
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="
            w-[55px]
            h-[55px]
            sm:w-[65px]
            sm:h-[65px]
            rounded-[12px]
            bg-[#F2F2F2]
            dark:bg-[#2a2d3a]
            text-[#2C4A7F]
            dark:text-[#8fb3e8]
            text-2xl
            font-bold
            text-center
            bg-[#D9D9D9]
            shadow-[inset_5px_5px_10px_#161b1d42,inset_-5px_-5px_10px_#FAFBFF] 
            dark:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
            focus:outline-none
            focus:scale-105
            transition-all
          "
        />
      ))}
    </div>

  </div>
</div>
                                            {/* Timer & Resend */}
                                            <div className="text-center mt-6">
    {canResend ? (
        <button
            onClick={handleResend}
            type="button"
            className="text-white font-semibold hover:underline"
        >
            Resend Code
        </button>
    ) : (
        <p className="text-white">
            Resend code in
            <span className="font-bold ml-2">
                {resendTimer}s
            </span>
        </p>
    )}
</div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isLoading || code.some(d => d === '')}
                                                className="
mx-auto
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
hover:scale-105
"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                        <span>Verifying...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faCheckCircle} />
                                                        <span>Verify Code</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        {/* Help Text */}
                                        
                                            
                                    </>
                                ) : (
                                    /* Success State */
                                    <div className="text-center py-10">
    <FontAwesomeIcon
        icon={faCircleCheck}
        className="text-[#E0E0E0] dark:text-[#2a2d3a] text-7xl"
    />

    <h2 className="text-white text-3xl font-bold mt-4">
        Code Verified
    </h2>

    <p className="text-white/80 mt-3">
        Redirecting to reset password...
    </p>
</div>
                                )}
                            

                         
                            
                        </div>
                    </div>
                                    </>
                            </div>

                            {/* Security Note */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs ">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <span>Your code expires in 10 minutes for security</span>
                            </div>
        </div>

    </div>

</div>
            
        </section>
    );
}