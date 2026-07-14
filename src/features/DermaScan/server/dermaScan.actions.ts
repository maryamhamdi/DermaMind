// "use server";
// import { cookies } from "next/headers";

// const API_BASE = "https://dermamind-api-production-a383.up.railway.app";

// export async function getScanHistory() {
//   const token = (await cookies()).get("token")?.value;

//   const res = await fetch(`${API_BASE}/api/DermaScan/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: "no-store",
//   });

//   if (!res.ok) throw new Error("Failed to fetch scan history");
//   return res.json();
// }

// export async function getScanHistoryById(id: string | number) {
//   const token = (await cookies()).get("token")?.value;

//   const res = await fetch(`${API_BASE}/api/DermaScan/history/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: "no-store",
//   });

//   if (!res.ok) throw new Error("Failed to fetch scan result");
//   return res.json();
// }


"use server";
import { cookies } from "next/headers";

const API_BASE = "https://dermamind-api-production-a383.up.railway.app";

export async function getScanHistory() {
  const token = (await cookies()).get("token")?.value;

  console.log("🟨 [getScanHistory] TOKEN PRESENT? =>", Boolean(token));

  const res = await fetch(`${API_BASE}/api/DermaScan/history`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  console.log("🟨 [getScanHistory] BACKEND STATUS =>", res.status);

  if (!res.ok) throw new Error("Failed to fetch scan history");

  const data = await res.json();
  console.log("🟨 [getScanHistory] COUNT =>", Array.isArray(data) ? data.length : "not an array");

  return data;
}

export async function getScanHistoryById(id: string | number) {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${API_BASE}/api/DermaScan/history/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch scan result");
  return res.json();
}