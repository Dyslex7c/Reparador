import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/utils/database"

export async function POST(req: Request) {
  await connectDB()

  const { name, email, password } = await req.json()

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()
    return NextResponse.json({ success: true, message: "User registered successfully!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

