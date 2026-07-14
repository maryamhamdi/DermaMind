import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
    return NextResponse.json(data.data || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
