import BeautyHealthyScreen from "@/src/features/categories/screens/beauty-healthy.screen"
// import { getProductsByCategory } from "@/src/features/products/server/chatbot.action"
import { getSubcategoriesByCategory } from "@/src/features/categories/server/subcategories.action"
import { CATEGORY_IDS } from "@/src/features/categories/config/categories.config"

export const metadata = {
    title: "Beauty & Health | E-Commerce",
    description: "Find premium skincare, makeup, and health products",
}

export default async function BeautyHealthyPage() {
    const categoryId = CATEGORY_IDS.BEAUTY_HEALTHY
    
    const [productsResponse, subcategoriesResponse] = await Promise.all([
        // getProductsByCategory(categoryId),
        getSubcategoriesByCategory(categoryId)
    ])
    
    return (
        <BeautyHealthyScreen 
            products={productsResponse.data} 
            subcategories={subcategoriesResponse.data || []} 
        />
    )
}
