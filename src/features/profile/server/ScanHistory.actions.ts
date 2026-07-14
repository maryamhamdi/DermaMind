"use server";

import axios from "axios";
import { getToken } from "../../auth/server/auth.action";

const BASE_URL =
  "https://dermamind-api-production-a383.up.railway.app";

export async function getScanReport(id: number) {
  const token = await getToken();

  const response = await axios.get(
    `${BASE_URL}/api/DermaScan/history/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}