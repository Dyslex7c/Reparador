import { NextResponse } from "next/server"
import User from "@/models/User"
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

  try {
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

