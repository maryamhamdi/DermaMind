import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

interface LoadingSpinnerProps {
    message?: string
    fullScreen?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ 
    message = "Loading...", 
    fullScreen = true,
    size = 'lg' 
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10'
    }

    const spinner = (
        <div className="bg-[#0622609a] rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
            <FontAwesomeIcon 
                icon={faSpinner} 
                className={`${sizeClasses[size]} text-white animate-spin`} 
            />
            <p className="text-white font-medium">{message}</p>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    )
}

// Inline spinner for buttons or small areas
export function InlineSpinner({ className = "" }: { className?: string }) {
    return (
        <FontAwesomeIcon 
            icon={faSpinner} 
            className={`animate-spin ${className}`} 
        />
    )
}
