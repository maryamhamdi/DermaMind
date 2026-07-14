'use server'

import axios, { AxiosRequestConfig } from "axios"

export default async function forgetPassword(email: string) {
    try {
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://dermamind-api-production-a383.up.railway.app/api/Auth/forget-password',
            data: {
                email
            }
        }

        const response = await axios.request(options)
        return response.data

    } catch (error: any) {

    console.log("FULL ERROR =>", error);

    console.log("RESPONSE =>", error?.response?.data);

    return {
        success: false,
        message:
            error?.response?.data?.message ||
            "Something went wrong"
    };
}
}

export async function verfiyRestCode(resetCode: string) {
    try {
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://dermamind-api-production-a383.up.railway.app/api/Auth/verify-otp',
            data: {
                otp: resetCode
            }
        }

        const response = await axios.request(options)
        return response.data

    } catch (error: any) {

    console.log("FULL ERROR =>", error);

    console.log("RESPONSE =>", error?.response?.data);

    return {
        success: false,
        message:
            error?.response?.data?.message ||
            "Something went wrong"
    };
}
}

export async function resetPassword(email: string, newPassword: string) {
    try {
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://dermamind-api-production-a383.up.railway.app/api/Auth/reset-password',
            data: {
                email,
                newPassword
            }
        }

        const response = await axios.request(options)
        return response.data

    } catch (error: any) {

    console.log("FULL ERROR =>", error);

    console.log("RESPONSE =>", error?.response?.data);

    return {
        success: false,
        message:
            error?.response?.data?.message ||
            "Something went wrong"
    };
}
}