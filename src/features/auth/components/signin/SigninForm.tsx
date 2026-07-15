"use client";
import { faSpinner, faEye, faEyeSlash, faArrowRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SigninSchema, SigninValuesTypes } from "../../schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninAction } from "../../server/signin.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setToken } from "../../server/auth.action";
import logo from "../../../../assets/images/logo.png";
import Image from "next/image";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAppDispatch } from "@/src/store/store";
import { setAuthInfo } from "../../store/auth.slice";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleSigninAction } from "../../../auth/server/googleSignin.action";

type AuthResponse = {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
  };
  message?: string;
  errors?: Record<string, string>;
};

export default function SigninForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const icons = [faGoogle];

  const { handleSubmit, register, reset, setError, formState: { errors, isSubmitting } } = useForm<SigninValuesTypes>({
    defaultValues: {
      email: '',
      password: '',
      keepme: false
    },
    resolver: zodResolver(SigninSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const onSubmit: SubmitHandler<SigninValuesTypes> = async (values) => {
    console.time("SIGNIN ACTION");
    const response: AuthResponse = await SigninAction(values);
    console.timeEnd("SIGNIN ACTION");

    if (response?.success && response.data) {
      await setToken(response.data.token, values.keepme ?? false);

      localStorage.removeItem("skinStep");
      localStorage.removeItem("skinData");

      dispatch(
        setAuthInfo({
          isAuthinticated: true,
          userInfo: {
            id: response.data.user.id,
            name: response.data.user.fullName,
            email: response.data.user.email,
            role: "user",
          },
        })
      );

      reset();
      toast.success("Welcome back!");

      router.push("/skin-test");
      return;
    } 
    else {
      if (response?.errors) {
        Object.keys(response.errors).forEach((key) => {
          setError(key as keyof SigninValuesTypes, { 
            message: response.errors![key] 
          });
        });
      }
      if (response?.message) {
        toast.error(response.message);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const response: AuthResponse = await GoogleSigninAction(idToken);

      if (response.success && response.data) {
        await setToken(response.data.token, true);

        dispatch(
          setAuthInfo({
            isAuthinticated: true,
            userInfo: {
              id: response.data.user.id,
              name: response.data.user.fullName,
              email: response.data.user.email,
              role: "user",
            },
          })
        );

        toast.success("Google Login Success");
        router.push("/skin-test");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google Login Failed");
    }
  };

  const handleGoogleClick = () => {
    const googleBtn = document.querySelector('#google-login-container [role="button"]') as HTMLElement;
    googleBtn?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#D5D5D6] dark:bg-[#1a1c24] min-h-screen transition-colors duration-300">
      <Image src={logo} alt="logo" className="w-[120px] mb-2" />
      <h1 className="text-[#2C4A7F] dark:text-[#8fb3e8] font-bold text-3xl sm:text-4xl mb-4 lg:mb-0">DermaMind</h1>
      <span className="hidden lg:block text-sm sm:text-[16px] font-bold bg-gradient-to-b from-[#B8753B] to-[#57300C] dark:from-[#e0b088] dark:to-[#d99a5b] bg-clip-text text-transparent pb-2">
        Where AI Meets Skin Health
      </span>

      <div className="w-full">
        <div className="w-full px-4 md:px-16 lg:px-24 mb-10">
          <div className="mt-2 w-full mx-auto max-w-[1000px] min-h-[380px] rounded-[50px] sm:rounded-[70px] md:rounded-[100px] px-6 md:px-12 py-8 bg-gradient-to-b from-[#3B6CB8] via-[#1687D6] to-[#0C81E4] dark:from-[#2a4a7a] dark:via-[#1483DA] dark:to-[#0C6BC0] shadow-...">
            {isSuccess ? (
              /* Success UI */
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white dark:bg-[#20222c] shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.9)]">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#1687D6] dark:text-[#5a9fe8] text-5xl" />
                </div>
                <h3 className="text-3xl font-bold text-white">Success</h3>
                <p className="text-white/80 text-center">Your account has been successfully signed in</p>
                <button onClick={() => router.push("/skin-test")} className="mt-4 px-10 py-3 rounded-[25px] bg-[#D9D9D9] ...">
                  Skin Test
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email, Password, Remember, Submit Button - (كما هي) */}
                {/* ... باقي الـ form كما كان ... */}
                <div className="flex flex-col items-center mb-4">
                  <label htmlFor="email" className="w-full max-w-[85%] text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className={`w-full max-w-[90%] px-5 py-4 rounded-[25px] bg-[#D9D9D9] ...`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="flex flex-col relative">
                  <label htmlFor="password" className="w-full max-w-[85%] mx-auto text-white text-lg sm:text-[20px] font-semibold text-left mb-1">
                    Password
                  </label>
                  <div className="w-full flex justify-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register('password')}
                      className={`w-full max-w-[90%] px-5 py-4 rounded-[25px] ...`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-[70%] -translate-y-1/2">
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between max-w-[90%] mx-auto mt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="keepme" {...register('keepme')} />
                    <label htmlFor="keepme" className="text-sm text-white">Keep me signed in</label>
                  </div>
                  <Link href="/forget-password" className="text-white text-sm sm:text-base hover:underline">Forgot password?</Link>
                </div>

                {/* Submit Button */}
                <div className="flex items-center flex-col">
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-1/2 md:w-[30%] mt-10 py-3 rounded-[25px] ...">
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Signing in...
                      </>
                    ) : (
                      <>Sign In <FontAwesomeIcon icon={faArrowRight} /></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Google Login */}
          <div id="google-login-container" className="hidden">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Login Failed")} />
          </div>

          {!isSuccess && (
            <>
              <p className="text-center text-sm pt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#1687D6] hover:underline">Create an account</Link>
              </p>

              <div className="text-center my-3">
                <span className="block text-sm font-bold mb-2">OR</span>
                <div className="flex gap-4 justify-center">
                  {icons.map((icon, i) => (
                    <div key={i} onClick={handleGoogleClick} className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center ...">
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
  );
}