import SkinTest from "@/src/features/skin-test/components/SkinTest";
import LoadingSpinner from "@/src/components/shared/LoadingSpinner"

export default function Loading() {
    return (
        <>
            <SkinTest />
            <LoadingSpinner message="Skin test Loading..." />
        </>
    )
}
