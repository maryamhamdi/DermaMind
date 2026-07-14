'use server'

import axios, { AxiosError } from "axios";

export async function GoogleSigninAction(idToken: string) {
    try {
        const { data } = await axios.post(
            "https://dermamind-api-production-a383.up.railway.app/api/Auth/google-login",
            { idToken }
        );

        return {
            success: true,
            message: "Signed in successfully",
            data
        };

    } catch (error) {
        if (error instanceof AxiosError) {
            const responseMessage =
                error.response?.data?.message ||
                error.response?.data?.error;

            return {
                success: false,
                message: responseMessage || "Google sign-in failed"
            };
        }

        return {
            success: false,
            message: "Unexpected server error"
        };
    }
}