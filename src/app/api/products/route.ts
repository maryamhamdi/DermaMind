export async function GET() {
  try {
    const res = await fetch(
      "https://dermamind-api-production.up.railway.app/api/Product"
    );

    // 👇 مهم جداً
    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch from external API" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}