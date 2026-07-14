// import { cookies } from "next/headers";

// export async function POST(req) {
//   const formData = await req.formData();
//   const token = (await cookies()).get("token")?.value;

//   try {
//     const response = await fetch(
//       "https://dermamind-api-production-a383.up.railway.app/api/DermaScan/diagnose/start",
//       {
//         method: "POST",
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: formData,
//       }
//     );

//     const data = await response.json();

//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     return Response.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }


import { cookies } from "next/headers";

const API_BASE = "https://dermamind-api-production-a383.up.railway.app";

export async function POST(req) {
  const formData = await req.formData();
  const token = (await cookies()).get("token")?.value;

  console.log("🟦 [diagnose-start] TOKEN PRESENT? =>", Boolean(token));

  try {
    const response = await fetch(`${API_BASE}/api/DermaScan/diagnose/start`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();

    console.log("🟦 [diagnose-start] BACKEND STATUS =>", response.status);
    console.log("🟦 [diagnose-start] BACKEND DATA =>", JSON.stringify(data));

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.log("🟦 [diagnose-start] ERROR =>", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}