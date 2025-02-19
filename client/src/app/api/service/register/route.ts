import { NextResponse } from "next/server"
import ServiceProvider from "@/models/ServiceProvider"
import connectDB from "@/utils/database"
import { verifyToken } from "@/utils/auth"

export async function POST(req: Request) {
  await connectDB()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const userId = verifyToken(token)
  if (!userId) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
  }

  const { name, service, rate, latitude, longitude } = await req.json()

  try {
    const provider = new ServiceProvider({
      name,
      service,
      rate,
      location: {
        type: "Point",
        coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
      },
    })
    await provider.save()
    return NextResponse.json({ success: true, message: "Service provider registered successfully!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

