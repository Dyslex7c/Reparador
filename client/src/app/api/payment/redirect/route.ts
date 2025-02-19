import { NextResponse } from "next/server"

const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@quickfixercom"

export async function GET() {
  return NextResponse.redirect(RAZORPAY_PAYMENT_LINK)
}

