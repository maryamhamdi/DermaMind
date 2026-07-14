"use server";

import axios from "axios";
import FormData from "form-data";
import { getToken } from "../../auth/server/auth.action";

const BASE_URL = "https://dermamind-api-production-a383.up.railway.app";

// ✅ جلب بيانات البروفايل الحقيقية (fullName, email, profileImage, skinType)
export async function getProfile() {
  const token = await getToken();

  const response = await axios.get(`${BASE_URL}/api/Profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// ✅ رفع/تحديث صورة البروفايل
// الـ endpoint الحقيقي هو /api/Profile/update وبياخد fullName + skinType + image مع بعض
// بنستخدم مكتبة "form-data" (مش الـ FormData الأصلية بتاعة المتصفح) لأن الكود ده شغال
// على السيرفر (Node.js) جوه Server Action، والـ FormData الأصلية مش بتبني multipart body
// صحيح مع axios من غير "form-data" — وده كان سبب الـ 405 اللي ظهر.
export async function uploadProfileImage(image: File) {
  const token = await getToken();

  // 1) هات البيانات الحالية الأول عشان منفقدهاش
  const currentProfile = await getProfile();

  // 2) حوّل الـ File (من المتصفح) لـ Buffer عشان نقدر نلصقه في form-data
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const form = new FormData();
  form.append("fullName", currentProfile?.fullName ?? "");
  form.append("skinType", currentProfile?.skinType ?? "");
  form.append("image", buffer, {
    filename: image.name || "profile.jpg",
    contentType: image.type || "image/jpeg",
  });

  try {
    const response = await axios.put(`${BASE_URL}/api/Profile/update`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });

    // بيرجع { message, fullName, skinType, profileImage }
    return response.data;
  } catch (error: any) {
    console.log("UPLOAD ERROR STATUS =>", error?.response?.status);
    console.log("UPLOAD ERROR DATA =>", error?.response?.data);
    console.log("UPLOAD ERROR HEADERS =>", error?.response?.headers);
    console.log("UPLOAD ERROR ALLOW HEADER =>", error?.response?.headers?.allow);
    throw error;
  }
}

// ✅ تحديث الاسم (وممكن skinType لو احتجتي) من غير ما نلمس الصورة
// بنستخدم نفس endpoint التحديث PUT /api/Profile/update بـ form-data
export async function updateProfile(fullName: string, skinType?: string) {
  const token = await getToken();

  // لو skinType مش متبعت، هاته من البروفايل الحالي عشان منفقدوش
  const currentProfile = skinType === undefined ? await getProfile() : null;

  const form = new FormData();
  form.append("fullName", fullName ?? "");
  form.append("skinType", skinType ?? currentProfile?.skinType ?? "");

  try {
    const response = await axios.put(`${BASE_URL}/api/Profile/update`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("UPDATE PROFILE ERROR STATUS =>", error?.response?.status);
    console.log("UPDATE PROFILE ERROR DATA =>", error?.response?.data);
    throw error;
  }
}

export async function getSkinTestResult() {
  const token = await getToken();

  const response = await axios.get(`${BASE_URL}/api/SkinTest/my-result`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}