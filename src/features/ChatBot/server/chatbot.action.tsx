'use server'

import axios, { AxiosRequestConfig } from "axios";

const BASE_URL =
  "https://dermamind-api-production-a383.up.railway.app";

export async function sendMessage(
  message: string,
  history: string[] = [],
  diagnosisContext: string = ""
) {
  try {
    const options: AxiosRequestConfig = {
      url: `${BASE_URL}/api/Chatbot/send`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        message,
        history,
        diagnosisContext,
      },
    };

    const { data } = await axios.request(options);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Failed to send message",
    };
  }
}