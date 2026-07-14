'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTimes,
    faHome,
    faLocationDot,
    faCity,
    faPhone,
    faSpinner,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Address, AddressFormData } from '../types/address.types'
import { addAddress } from '../server/profile.actions'

const addressSchema = z.object({
    name: z.string().min(2, 'Address name must be at least 2 characters'),
    details: z.string().min(5, 'Please provide detailed address'),
    city: z.string().min(2, 'City is required'),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number')
})

interface AddressFormModalProps {
    onClose: () => void
    onSuccess: (addresses: Address[]) => void
}

export default function AddressFormModal({ onClose, onSuccess }: AddressFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: '',
            details: '',
            city: '',
            phone: ''
        }
    })

    const onSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true)
        try {
            const response = await addAddress(data)
            onSuccess(response.data || [])
        } catch (error) {
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#20222c] rounded-2xl shadow-xl dark:shadow-black/50 w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faPlus} />
                            </span>
                            <div>
                                <h3 className="font-semibold text-lg">Add New Address</h3>
                                <p className="text-sm text-emerald-100">Save a delivery address</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                    {/* Address Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Address Name <span className="text-rose-500 dark:text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FontAwesomeIcon icon={faHome} />
                            </span>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="e.g. Home, Office, Work"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-[#2a2d3a] dark:bg-[#2a2d3a] dark:text-gray-100 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.name.message}</p>
                        )}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            City <span className="text-rose-500 dark:text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FontAwesomeIcon icon={faCity} />
                            </span>
                            <input
                                type="text"
                                {...register('city')}
                                placeholder="e.g. Cairo, Alexandria, Giza"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-[#2a2d3a] dark:bg-[#2a2d3a] dark:text-gray-100 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all"
                            />
                        </div>
                        {errors.city && (
                            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.city.message}</p>
                        )}
                    </div>

                    {/* Address Details */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Address Details <span className="text-rose-500 dark:text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </span>
                            <textarea
                                {...register('details')}
                                rows={3}
                                placeholder="Street, building, floor, apt number..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a2d3a] dark:bg-[#2a2d3a] dark:text-gray-100 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all resize-none"
                            />
                        </div>
                        {errors.details && (
                            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.details.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number <span className="text-rose-500 dark:text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FontAwesomeIcon icon={faPhone} />
                            </span>
                            <input
                                type="tel"
                                {...register('phone')}
                                placeholder="01xxxxxxxxx"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-[#2a2d3a] dark:bg-[#2a2d3a] dark:text-gray-100 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all"
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 border border-gray-200 dark:border-[#2a2d3a] text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2d3a] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Add Address</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}