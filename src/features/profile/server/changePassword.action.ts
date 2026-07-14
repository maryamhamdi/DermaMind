"use server";

import axios from "axios";
import { getToken } from "../../auth/server/auth.action";
const BASE_URL = "https://dermamind-api-production-a383.up.railway.app";

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const token = await getToken();

  try {
    const response = await axios.post(
      `${BASE_URL}/api/Profile/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CHANGE PASSWORD ERROR STATUS =>", error?.response?.status);
    console.log("CHANGE PASSWORD ERROR DATA =>", error?.response?.data);
    console.log("CHANGE PASSWORD ERROR ALLOW HEADER =>", error?.response?.headers?.allow);
    throw error;
  }
}