'use server'

import axios from "axios"

const BASE_URL =
  "https://dermamind-api-production-a383.up.railway.app"

export default async function getCategories() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/Product`
    )

    return { data }
  } catch (error) {
    console.error("Failed to fetch categories:", error)

    return { data: [] }
  }
}