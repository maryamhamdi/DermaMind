"use server";

import axios from "axios";
import { getToken } from "@/src/features/auth/server/auth.action";

export async function getSkinQuestions() {
  try {
    const response = await axios.get(
      "https://dermamind-api-production-a383.up.railway.app/api/SkinTest/questions"
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function submitSkinTest(selectedOptionIds: number[]) {
  try {
    console.log("SENDING =>", selectedOptionIds);

    const token = await getToken();
    console.log("TOKEN =>", token);
    const response = await axios.post(
      "https://dermamind-api-production-a383.up.railway.app/api/SkinTest/submit",
      {
        selectedOptionIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SUCCESS =>", response.data);

    return response.data;
  } catch (error: any) {
    console.log("STATUS =>", error?.response?.status);
    console.log("DATA =>", error?.response?.data);

    throw error;
  }
}

// ✅ جلب نتيجة سابقة لو موجودة (يستخدم لمعرفة هل اليوزر عمل الاختبار قبل كده)
// بترجع null لو مفيش نتيجة محفوظة (404 / أي error)، أو الـ result نفسه لو موجود
export async function getSkinResult() {
  try {
    const token = await getToken();

    const response = await axios.get(
      "https://dermamind-api-production-a383.up.railway.app/api/SkinTest/my-result",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("NO EXISTING RESULT =>", error?.response?.status);
    return null;
  }
}