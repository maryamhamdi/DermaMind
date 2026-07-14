'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faPhone,
    faSave,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { useAppSelector } from '@/src/store/store'
import { getProfile, updateProfile } from '../server/ProfileInfo.actions'
import { faPen } from "@fortawesome/free-solid-svg-icons";
export default function ProfileInfo() {
    const { userInfo } = useAppSelector(state => state.auth)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isEditingName, setIsEditingName] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('')

    // ✅ نجيب الاسم والإيميل الحقيقيين من السيرفر (مش بس من الـ Redux store)
   useEffect(() => {
  const loadProfile = async () => {
    try {
      const result = await getProfile()

      setFullName(result?.fullName || userInfo?.name || '')
      setEmail(result?.email || userInfo?.email || '')
      setPhoneNumber(result?.phoneNumber || '')
    } catch (error) {
      console.log(error)

      setFullName(userInfo?.name || '')
      setEmail(userInfo?.email || '')
      setPhoneNumber('')
    }
  }

  loadProfile()
}, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!fullName.trim()) {
            toast.error('Full name cannot be empty')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await updateProfile(fullName,phoneNumber)
            console.log('UPDATE PROFILE RESULT =>', result)

            const message = result?.message ?? 'Profile updated successfully!'
            toast.success(message)
            setSuccessMessage(message)
            setTimeout(() => setSuccessMessage(''), 4000)

            // ✅ نبعت إشارة لباقي الصفحة (السايد بار في ProfileScreen) إنه يجيب
            // البيانات الجديدة تاني بدون ما نطلب من اليوزر يعمل refresh يدوي
            window.dispatchEvent(new CustomEvent('profile-updated'))

            // ✅ لو السيرفر رجّع الاسم النهائي، نعرضه (احتياطي لو حصل أي trimming من السيرفر)
            if (result?.fullName) {
                setFullName(result.fullName)
            }
        } catch (error: any) {
            console.log(error)
            const backendMessage =
                error?.response?.data?.message || 'Failed to update profile'
            toast.error(backendMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-[#dfe5ec] dark:bg-[#242732] rounded-2xl overflow-hidden transition-colors duration-300">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-[#2a2d3a]">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#482502] dark:bg-[#d99a5b] text-white dark:text-[#1a1c24] rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-[#482502] dark:text-[#d99a5b]">Profile Information</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* ✅ رسالة النجاح من السيرفر - بتختفي تلقائي بعد 4 ثواني */}
                {successMessage && (
                    <p className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                        {successMessage}
                    </p>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#482502] dark:text-[#d99a5b]">Full Name</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                       <div className="relative">
  <input
    type="text"
    value={fullName}
    disabled={!isEditingName}
    onChange={(e) => setFullName(e.target.value)}
    className="w-full h-11 pl-10 pr-12 rounded-[25px]
               bg-[#f6f1f1] dark:bg-[#2a2d3a]
               outline-none
               text-[#02246e] dark:text-[#8fb3e8]
               shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
               dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
  />

  <button
    type="button"
    onClick={() => setIsEditingName(true)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0C81E4] dark:text-[#5a9fe8] hover:scale-110 transition"
  >
    <FontAwesomeIcon icon={faPen} />
  </button>
</div>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#482502] dark:text-[#d99a5b]">Email Address</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            disabled
                            className="w-full h-11 pl-10 pr-4 rounded-[25px]
                                        bg-[#f6f1f1] dark:bg-[#2a2d3a]
outline-none text-[#02246e] dark:text-[#8fb3e8]
shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FontAwesomeIcon icon={faPhone} />
                        </span>
                        <div className="relative">
                        <input
                            type="tel"
                            value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="01xxxxxxxxx"
                            className="w-full h-11 pl-10 pr-4 rounded-[25px]
                                        bg-[#f6f1f1] dark:bg-[#2a2d3a]
outline-none text-[#02246e] dark:text-[#8fb3e8]
shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]
dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                        />
                         <button
    type="button"
    onClick={() => setIsEditingName(true)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0C81E4] dark:text-[#5a9fe8] hover:scale-110 transition"
  >
    <FontAwesomeIcon icon={faPen} />
    </button>
    </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5  rounded-[50] bg-[#dfe5ec] dark:bg-[#2a2d3a]  font-bold text-base sm:text-lg
                                        shadow-[4px_4px_12px_rgba(12,129,228,0.25),-4px_-4px_12px_rgba(255,255,255,0.8)]
dark:shadow-[4px_4px_12px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.05)]
hover:scale-[0.98] text-[#02246e] dark:text-[#8fb3e8]
hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)]
dark:hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.05)]
transition-all duration-200"
                >
                    {isSubmitting ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSave} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}