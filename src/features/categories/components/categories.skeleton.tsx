// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faLayerGroup } from "@fortawesome/free-solid-svg-icons"

// // Category Card Skeleton
// export function CategoryCardSkeleton() {
//     return (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             {/* Image Skeleton */}
//             <div className="aspect-square bg-gray-200 animate-pulse"></div>
//             {/* Name Skeleton */}
//             <div className="p-3 sm:p-4 text-center border-t border-gray-100">
//                 <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
//             </div>
//         </div>
//     )
// }

// // Featured Category Card Skeleton
// export function FeaturedCategoryCardSkeleton() {
//     return (
//         <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 flex items-center gap-4">
//             <div className="h-20 w-20 bg-white/20 rounded-xl animate-pulse shrink-0"></div>
//             <div className="flex-1 min-w-0 space-y-2">
//                 <div className="h-5 w-32 bg-white/30 rounded animate-pulse"></div>
//                 <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
//             </div>
//             <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse"></div>
//         </div>
//     )
// }

// // Categories Grid Skeleton
// interface CategoriesGridSkeletonProps {
//     count?: number
// }

// export function CategoriesGridSkeleton({ count = 12 }: CategoriesGridSkeletonProps) {
//     return (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
//             {[...Array(count)].map((_, i) => (
//                 <CategoryCardSkeleton key={i} />
//             ))}
//         </div>
//     )
// }

// // Header Banner Skeleton
// export function CategoriesHeaderSkeleton() {
//     return (
//         <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-10 sm:py-14">
//             <div className="container mx-auto px-4">
//                 <div className="flex items-center gap-3 mb-2">
//                     <span className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//                         <FontAwesomeIcon icon={faLayerGroup} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                     </span>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Browse Categories</h1>
//                 </div>
//                 <p className="text-emerald-100 text-sm sm:text-base">Loading categories...</p>
//             </div>
//         </div>
//     )
// }

// // Stats Bar Skeleton
// export function StatsBarSkeleton() {
//     return (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                     <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
//                     <div className="space-y-2">
//                         <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
//                         <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
//                     </div>
//                 </div>
//                 <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
//             </div>
//         </div>
//     )
// }

// // Complete Page Skeleton
// export function AllCategoriesPageSkeleton() {
//     return (
//         <section className="min-h-screen bg-gray-50">
//             <CategoriesHeaderSkeleton />

//             <div className="container mx-auto px-4 py-8 sm:py-12">
//                 <StatsBarSkeleton />
//                 <CategoriesGridSkeleton count={12} />

//                 {/* Featured Section Skeleton */}
//                 <div className="mt-12">
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
//                         <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
//                     </div>
//                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                         {[1, 2, 3].map((i) => (
//                             <FeaturedCategoryCardSkeleton key={i} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }
