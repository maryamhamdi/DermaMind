// Subcategory item type
export interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
    createdAt?: string;
    updatedAt?: string;
}

// Subcategories API response type
export interface SubcategoriesResponse {
    results: number;
    metadata?: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
        nextPage?: number;
    };
    data: Subcategory[];
}
