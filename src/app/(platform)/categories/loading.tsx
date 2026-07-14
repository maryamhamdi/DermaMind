// import { AllCategoriesPageSkeleton } from "@/src/features/categories/components/categories.skeleton"
import LoadingSpinner from "@/src/components/shared/LoadingSpinner"

export default function Loading() {
    return (
        <>
            {/* <AllCategoriesPageSkeleton /> */}
            <LoadingSpinner message="Loading Categories..." />
        </>
    )
}
