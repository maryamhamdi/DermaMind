'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLocationDot,
    faPlus,
    faTrash,
    faPhone,
    faCity,
    faHome,
    faSpinner,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import { Address } from '../types/address.types'
import { getUserAddresses, removeAddress } from '../server/profile.actions'
import { toast } from 'react-toastify'
import AddressFormModal from './AddressFormModal'

export default function MyAddresses() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)

    const fetchAddresses = async () => {
        try {
            setIsLoading(true)
            const response = await getUserAddresses()
            setAddresses(response.data || [])
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleDelete = async (addressId: string) => {
        setDeletingId(addressId)
        try {
            const response = await removeAddress(addressId)
            setAddresses(response.data || [])
            toast.success('Address removed successfully')
        } catch (error) {
            toast.error('Failed to remove address')
        } finally {
            setDeletingId(null)
        }
    }

    const handleAddressAdded = (newAddresses: Address[]) => {
        setAddresses(newAddresses)
        setShowAddModal(false)
        toast.success('Address added successfully')
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <FontAwesomeIcon icon={faSpinner} className="text-3xl text-emerald-500 dark:text-emerald-400 animate-spin" />
                <span className="ml-3 text-gray-500 dark:text-gray-400">Loading addresses...</span>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">My Addresses</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="hidden sm:inline">Add Address</span>
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-[#2a2d3a] mb-4">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Addresses Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first delivery address to make checkout faster and easier.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
                    >
                        Add New Address
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="bg-white dark:bg-[#20222c] rounded-2xl border border-gray-100 dark:border-[#2a2d3a] p-5 hover:shadow-lg dark:hover:shadow-black/40 transition-shadow"
                        >
                            {/* Address Name Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHome} className="text-sm" />
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{address.name}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    disabled={deletingId === address._id}
                                    className="w-8 h-8 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === address._id ? (
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    ) : (
                                        <FontAwesomeIcon icon={faTrash} />
                                    )}
                                </button>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                    <FontAwesomeIcon icon={faLocationDot} className="mt-1 text-gray-400 dark:text-gray-500" />
                                    <span>{address.details}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <FontAwesomeIcon icon={faCity} className="text-gray-400 dark:text-gray-500" />
                                    <span>{address.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500" />
                                    <span>{address.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Address Modal */}
            {showAddModal && (
                <AddressFormModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddressAdded}
                />
            )}
        </div>
    )
}