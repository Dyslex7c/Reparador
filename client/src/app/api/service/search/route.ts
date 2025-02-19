import { NextResponse } from "next/server"
import ServiceProvider from "@/models/ServiceProvider"
import connectDB from "@/utils/database"
import { verifyToken } from "@/utils/auth"

export async function GET(req: Request) {
  await connectDB()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const userId = verifyToken(token)
  if (!userId) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const service = searchParams.get("service")

  if (!latitude || !longitude || !service) {
    return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 })
  }

  try {
    const providers = await ServiceProvider.find({
      service: { $regex: new RegExp(service, "i") },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)] },
          $maxDistance: 5000,
        },
      },
    })

    return NextResponse.json({ success: true, providers })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

