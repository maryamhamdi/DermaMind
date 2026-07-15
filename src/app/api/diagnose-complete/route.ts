// 
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const API_BASE = "https://dermamind-api-production-a383.up.railway.app";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = (await cookies()).get("token")?.value;
   console.log("🟩 [diagnose-complete] TOKEN PRESENT? =>", Boolean(token));

  try {
    const response = await fetch(`${API_BASE}/api/DermaScan/diagnose/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("🟩 [diagnose-complete] BACKEND STATUS =>", response.status);
    console.log("🟩 [diagnose-complete] BACKEND DATA =>", JSON.stringify(data));

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.log("🟩 [diagnose-complete] ERROR =>", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
