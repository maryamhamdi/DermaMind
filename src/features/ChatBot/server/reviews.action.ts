// 'use server'

// import axios, { AxiosRequestConfig } from "axios";
// import { getToken } from "@/src/features/auth/server/auth.action";
// import { ReviewsResponse, CreateReviewResponse } from "../types/reviewsTypes";

// const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

// /**
//  * Get all reviews for a specific product
//  */
// export async function getProductReviews(productId: string): Promise<{
//     success: boolean;
//     data?: ReviewsResponse;
//     error?: string;
// }> {
//     try {
//         const options: AxiosRequestConfig = {
//             url: `${BASE_URL}/products/${productId}/reviews`,
//             method: 'GET',
//         };

//         const response = await axios.request<ReviewsResponse>(options);
        
//         return {
//             success: true,
//             data: response.data
//         };
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || "Failed to fetch reviews"
//             };
//         }
//         return {
//             success: false,
//             error: "An unexpected error occurred"
//         };
//     }
// }

// /**
//  * Create a new review for a product
//  * Requires authentication
//  */
// export async function createProductReview(
//     productId: string,
//     review: string,
//     rating: number
// ): Promise<{
//     success: boolean;
//     data?: CreateReviewResponse;
//     error?: string;
// }> {
//     try {
//         const token = await getToken();
        
//         if (!token) {
//             return {
//                 success: false,
//                 error: "You must be logged in to submit a review"
//             };
//         }

//         const options: AxiosRequestConfig = {
//             url: `${BASE_URL}/products/${productId}/reviews`,
//             method: 'POST',
//             headers: {
//                 token,
//                 'Content-Type': 'application/json'
//             },
//             data: {
//                 review,
//                 rating
//             }
//         };

//         const response = await axios.request<CreateReviewResponse>(options);
        
//         return {
//             success: true,
//             data: response.data
//         };
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || "Failed to submit review"
//             };
//         }
//         return {
//             success: false,
//             error: "An unexpected error occurred"
//         };
//     }
// }

// /**
//  * Get all reviews (not product-specific)
//  */
// export async function getAllReviews(): Promise<{
//     success: boolean;
//     data?: ReviewsResponse;
//     error?: string;
// }> {
//     try {
//         const options: AxiosRequestConfig = {
//             url: `${BASE_URL}/reviews`,
//             method: 'GET',
//         };

//         const response = await axios.request<ReviewsResponse>(options);
        
//         return {
//             success: true,
//             data: response.data
//         };
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || "Failed to fetch reviews"
//             };
//         }
//         return {
//             success: false,
//             error: "An unexpected error occurred"
//         };
//     }
// }
