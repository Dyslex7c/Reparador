import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import connectDB from "@/utils/database"

export async function POST(req: Request) {
  await connectDB()

  const { email, password } = await req.json()

  try {
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" })
    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

