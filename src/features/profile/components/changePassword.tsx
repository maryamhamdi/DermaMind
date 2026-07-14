'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLock,
    faEye,
    faEyeSlash,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { changePassword } from "../server/changePassword.action";
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export default function ChangePassword() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: ChangePasswordValues) => {
        setIsSubmitting(true);

        try {
            const result = await changePassword(
                data.currentPassword,
                data.newPassword
            );

            console.log(result);

            // ✅ نعرض رسالة السيرفر الحقيقية ("Password changed successfully!")
            const message = result?.message ?? "Password changed successfully!";
            setSuccessMessage(message);
            toast.success(message);

            // تختفي الرسالة تلقائياً بعد 4 ثواني
            setTimeout(() => setSuccessMessage(""), 4000);

            reset();
        } catch (error: any) {
            console.log(error);
            setSuccessMessage("");

            // ✅ نعرض رسالة الخطأ الحقيقية لو موجودة (زي "Incorrect password.")
            const backendMessage =
                error?.response?.data?.errors?.[0]?.description ||
                error?.response?.data?.message ||
                "Failed to change password";

            toast.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" rounded-2xl  overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-[#2a2d3a]">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#482502] dark:bg-[#d99a5b] text-white dark:text-[#1a1c24] rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faLock} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-[#482502] dark:text-[#d99a5b]">Change Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                {/* ✅ رسالة النجاح من السيرفر */}
                {successMessage && (
                    <p className="text-sm text-white bg-[#4f2304] dark:bg-[#d99a5b] dark:text-[#1a1c24] p-3 rounded-xl">
                        {successMessage}
                    </p>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#482502] dark:text-[#d99a5b]">Current Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            {...register('currentPassword')}
                            placeholder="Enter your current password"
                            className="w-full h-11 pl-10 pr-12 rounded-[25px]
                                        bg-[#f6f1f1] dark:bg-[#2a2d3a]
outline-none text-[#02246e] dark:text-[#8fb3e8]
shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.currentPassword.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#482502] dark:text-[#d99a5b]">New Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            {...register('newPassword')}
                            placeholder="Enter your new password"
                            className="w-full h-11 pl-10 pr-12 rounded-[25px]
                                        bg-[#f6f1f1] dark:bg-[#2a2d3a]
outline-none text-[#02246e] dark:text-[#8fb3e8]
shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Must be at least 6 characters</p>
                    {errors.newPassword && (
                        <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.newPassword.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#482502] dark:text-[#d99a5b]">Confirm New Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            placeholder="Confirm your new password"
                            className="w-full h-11 pl-10 pr-12 rounded-[25px]
                                        bg-[#f6f1f1] dark:bg-[#2a2d3a]
outline-none text-[#02246e] dark:text-[#8fb3e8]
shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5  rounded-[50] shadow-[4px_4px_12px_rgba(12,129,228,0.25),-4px_-4px_12px_rgba(255,255,255,0.8)]
dark:shadow-[4px_4px_12px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.05)]
hover:scale-[0.98] text-[#02246e] dark:text-[#8fb3e8]
hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)]
dark:hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.05)]
transition-all duration-200"
                >
                    {isSubmitting ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            <span>Changing...</span>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faLock} />
                            <span>Change Password</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}