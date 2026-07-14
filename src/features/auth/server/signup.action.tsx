'use server';

import { SignupSchema, SignupSchemaType } from "../schemas/signupschema";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export async function SignupAction(values: SignupSchemaType) {

    const reValidationResult = SignupSchema.safeParse(values);

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

    const formData = new FormData();

    formData.append("FullName", values.name);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("ConfirmPassword", values.rePassword);

    if (values.profileImage?.[0]) {
        formData.append(
            "ProfileImage",
            values.profileImage[0]
        );
    }

    const { data } = await axios({
        url: "https://dermamind-api-production-a383.up.railway.app/api/Auth/register",
        method: "POST",
        data: formData
    });

    return {
        success: true,
        message: "Account Created Successfully",
        data
    };

}
catch (error) {

    if (error instanceof AxiosError) {

        console.log("STATUS =>", error.response?.status);
        console.log("DATA =>", error.response?.data);

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Something went wrong"
        };
    }

    console.log(error);

    return {
        success: false,
        message: "Unexpected error"
    };

}}