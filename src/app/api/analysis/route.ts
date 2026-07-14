export async function POST(req) {
  const formData = await req.formData();

  try {
    const response = await fetch(
     "https://dermamind-api-production-a383.up.railway.app/api/DermaScan/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}