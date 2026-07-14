// interface CategoryPageSkeletonProps {
//     heroGradient?: string
//     title?: string
// }

// export function CategoryPageSkeleton({ 
//     heroGradient = "from-gray-400 to-gray-500",
//     title = "Loading..." 
// }: CategoryPageSkeletonProps) {
//     return (
//         // <section className="min-h-screen bg-gray-50 animate-pulse">
//         //     {/* Hero Banner Skeleton */}
//         //     <div className={`bg-gradient-to-r ${heroGradient} py-10 sm:py-14 opacity-50`}>
//         //         <div className="container mx-auto px-4">
//         //             <div className="flex items-center gap-4 mb-4">
//         //                 <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 rounded-xl"></div>
//         //                 <div>
//         //                     <div className="h-8 w-48 bg-white/30 rounded-lg mb-2"></div>
//         //                     <div className="h-4 w-72 bg-white/20 rounded-lg"></div>
//         //                 </div>
//         //             </div>
//         //             <div className="flex gap-3 mt-6">
//         //                 {[...Array(4)].map((_, i) => (
//         //                     <div key={i} className="h-10 w-10 bg-white/10 rounded-lg"></div>
//         //                 ))}
//         //             </div>
//         //         </div>
//         //     </div>

//         //     <div className="container mx-auto px-4 py-8">
//         //         {/* Top Bar Skeleton */}
//         //         {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
//         //             <div className="flex flex-col lg:flex-row gap-4">
//         //                 <div className="flex-1 h-11 bg-gray-100 rounded-xl"></div>
//         //                 <div className="flex gap-3">
//         //                     <div className="h-11 w-24 bg-gray-100 rounded-xl"></div>
//         //                     <div className="h-11 w-32 bg-gray-100 rounded-xl"></div>
//         //                 </div>
//         //             </div>
//         //             <div className="mt-4">
//         //                 <div className="h-4 w-32 bg-gray-100 rounded-lg"></div>
//         //             </div>
//         //         </div> */}

//         //         {/* Main Content */}
//         //         <div className="flex gap-6">
//         //             {/* Sidebar Skeleton */}
//         //             <aside className="hidden lg:block w-72 shrink-0">
//         //                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         //                     <div className="p-4 border-b border-gray-100">
//         //                         <div className="h-5 w-20 bg-gray-100 rounded"></div>
//         //                     </div>
//         //                     <div className="p-4 space-y-4">
//         //                         {[...Array(3)].map((_, i) => (
//         //                             <div key={i} className="space-y-2">
//         //                                 <div className="h-4 w-24 bg-gray-100 rounded"></div>
//         //                                 {[...Array(4)].map((_, j) => (
//         //                                     <div key={j} className="h-10 bg-gray-50 rounded-lg"></div>
//         //                                 ))}
//         //                             </div>
//         //                         ))}
//         //                     </div>
//         //                 </div>
//         //             </aside>

//         //             {/* Products Grid Skeleton */}
//         //             <main className="flex-1">
//         //                 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//         //                     {[...Array(8)].map((_, i) => (
//         //                         <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         //                             <div className="aspect-square bg-gray-100"></div>
//         //                             <div className="p-4 space-y-2">
//         //                                 <div className="h-4 w-full bg-gray-100 rounded"></div>
//         //                                 <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
//         //                                 <div className="h-5 w-1/3 bg-gray-100 rounded"></div>
//         //                             </div>
//         //                         </div>
//         //                     ))}
//         //                 </div>
//         //             </main>
//         //         </div>
//         //     </div>
//         // </section>
//     )
// }

// // Specific category skeletons with their colors
// export function ElectronicsPageSkeleton() {
//     return <CategoryPageSkeleton heroGradient="from-blue-600 to-indigo-700" title="Electronics" />
// }

// export function WomensFashionPageSkeleton() {
//     return <CategoryPageSkeleton heroGradient="from-pink-500 to-rose-600" title="Women's Fashion" />
// }

// export function MensFashionPageSkeleton() {
//     return <CategoryPageSkeleton heroGradient="from-slate-700 to-gray-800" title="Men's Fashion" />
// }

// export function BeautyHealthyPageSkeleton() {
//     return <CategoryPageSkeleton heroGradient="from-purple-500 to-fuchsia-600" title="Beauty & Health" />
// }
