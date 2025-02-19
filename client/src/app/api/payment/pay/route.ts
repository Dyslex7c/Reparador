import { NextResponse } from "next/server"

const RAZORPAY_PAYMENT_LINK = "https://rzp.io/rzp/amFKUuk"

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ success: true, url: RAZORPAY_PAYMENT_LINK })
}

