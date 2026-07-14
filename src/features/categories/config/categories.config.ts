import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { 
    faLaptop, 
    faMobileAlt, 
    faHeadphones, 
    faCamera,
    faGamepad,
    faTv 
} from "@fortawesome/free-solid-svg-icons"
import { 
    faShirt as faPersonDress, 
    faBagShopping,
    faHatCowboy,
    faShoePrints
} from "@fortawesome/free-solid-svg-icons"
import { 
    faUserTie, 
    faTshirt,
    faShirt
} from "@fortawesome/free-solid-svg-icons"
import { 
    faSprayCanSparkles, 
    faPumpSoap, 
    faHeart,
    faSpa
} from "@fortawesome/free-solid-svg-icons"

// Category IDs from the API
export const CATEGORY_IDS = {
    ELECTRONICS: "6439d2d167d9aa4ca970649f",
    WOMENS_FASHION: "6439d58a0049ad0b52b9003f",
    MENS_FASHION: "6439d5b90049ad0b52b90048",
    // Note: Update this ID when you get the correct one from the API
    BEAUTY_HEALTHY: "6439d2f667d9aa4ca97064a8"
} as const

// Type for category configuration
export interface CategoryConfig {
    id: string;
    name: string;
    slug: string;
    description: string;
    heroGradient: string;
    accentColor: string;
    accentColorLight: string;
    accentColorDark: string;
    icon: IconDefinition;
    featuredIcons: IconDefinition[];
    bannerImage?: string;
}

// Category configurations
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    electronics: {
        id: CATEGORY_IDS.ELECTRONICS,
        name: "Electronics",
        slug: "electronics",
        description: "Discover the latest gadgets, smartphones, laptops, and electronic devices",
        heroGradient: "from-blue-600 to-indigo-700",
        accentColor: "blue",
        accentColorLight: "blue-100",
        accentColorDark: "blue-600",
        icon: faLaptop,
        featuredIcons: [faLaptop, faMobileAlt, faHeadphones, faCamera, faGamepad, faTv]
    },
    "womens-fashion": {
        id: CATEGORY_IDS.WOMENS_FASHION,
        name: "Women's Fashion",
        slug: "womens-fashion",
        description: "Explore trendy clothing, accessories, and footwear for women",
        heroGradient: "from-pink-500 to-rose-600",
        accentColor: "pink",
        accentColorLight: "pink-100",
        accentColorDark: "pink-600",
        icon: faPersonDress,
        featuredIcons: [faPersonDress, faBagShopping, faHatCowboy, faShoePrints]
    },
    "mens-fashion": {
        id: CATEGORY_IDS.MENS_FASHION,
        name: "Men's Fashion",
        slug: "mens-fashion",
        description: "Shop the latest trends in men's clothing, shoes, and accessories",
        heroGradient: "from-slate-700 to-gray-800",
        accentColor: "slate",
        accentColorLight: "slate-100",
        accentColorDark: "slate-600",
        icon: faUserTie,
        featuredIcons: [faUserTie, faTshirt, faShirt]
    },
    "beauty-healthy": {
        id: CATEGORY_IDS.BEAUTY_HEALTHY,
        name: "Beauty & Health",
        slug: "beauty-healthy",
        description: "Find premium skincare, makeup, and health products",
        heroGradient: "from-purple-500 to-fuchsia-600",
        accentColor: "purple",
        accentColorLight: "purple-100",
        accentColorDark: "purple-600",
        icon: faSpa,
        featuredIcons: [faSpa, faSprayCanSparkles, faPumpSoap, faHeart]
    }
}

// Helper function to get category config
export function getCategoryConfig(slug: string): CategoryConfig | undefined {
    return CATEGORY_CONFIGS[slug]
}

// Helper function to get all category configs
export function getAllCategoryConfigs(): CategoryConfig[] {
    return Object.values(CATEGORY_CONFIGS)
}
