'use server'

import axios, { AxiosRequestConfig } from "axios"
import { SubcategoriesResponse } from "../types/Subcategory.response.type"

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1'

/**
 * Get all subcategories for a specific category
 */
export async function getSubcategoriesByCategory(categoryId: string): Promise<SubcategoriesResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/categories/${categoryId}/subcategories`,
            method: 'GET',
        }
        const { data } = await axios.request(options)
        return data
    } catch (error) {
        throw error
    }
}

/**
 * Get a specific subcategory by ID
 */
export async function getSubcategoryById(subcategoryId: string): Promise<{ data: { _id: string; name: string; slug: string; category: string } }> {
    try {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/subcategories/${subcategoryId}`,
            method: 'GET',
        }
        const { data } = await axios.request(options)
        return data
    } catch (error) {
        throw error
    }
}

/**
 * Get all subcategories (without filtering by category)
 */
export async function getAllSubcategories(limit?: number): Promise<SubcategoriesResponse> {
    try {
        const params = limit ? `?limit=${limit}` : ''
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/subcategories${params}`,
            method: 'GET',
        }
        const { data } = await axios.request(options)
        return data
    } catch (error) {
        throw error
    }
}
