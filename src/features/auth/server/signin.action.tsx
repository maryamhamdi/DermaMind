'use server'

import axios, { AxiosError } from "axios";
import { SigninSchema, SigninValuesTypes } from "../schemas/signin.schema";

type SigninSuccess = {
    success: true;
    message: string;
    data: {
        token: string;
        user: {
            id: string;
            fullName: string;
            email: string;
        };
    };
};

type SigninFailure = {
    success: false;
    message: string;
    errors?: Record<string, string>;
};

type SigninResult = SigninSuccess | SigninFailure;

export async function SigninAction(values: SigninValuesTypes): Promise<SigninResult> {

    // VALIDATION
    const reValidationResult = SigninSchema.safeParse(values);

    if (!reValidationResult.success) {

        const errors: Record<string, string> = {};

        reValidationResult.error.issues.forEach((issue) => {

            const field = issue.path[0] as string;

            if (!errors[field]) {
                errors[field] = issue.message;
            }
        });

        return {
            success: false,
            message: "Validation Failed",
            errors
        };
    }

    try {

        // REMOVE KEEP ME
        const { keepme, ...requestBody } = values;

        // API REQUEST
        const { data } = await axios.post(
            "https://dermamind-api-production-a383.up.railway.app/api/Auth/login",
            requestBody
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
                error.response?.data?.title;

            // INVALID EMAIL OR PASSWORD
            if (
                responseMessage?.toLowerCase().includes("incorrect") ||
                responseMessage?.toLowerCase().includes("invalid") ||
                error.response?.status === 401
            ) {
                return {
                    success: false,
                    message: "Incorrect email or password",
                    errors: {
                        password: "Incorrect email or password"
                    }
                };
            }

            // VALIDATION ERRORS
            if (error.response?.status === 400) {

                return {
                    success: false,
                    message: responseMessage || "Validation error"
                };
            }

            return {
                success: false,
                message: responseMessage || "Something went wrong"
            };
        }

        return {
            success: false,
            message: "Unexpected server error"
        };
    }
}