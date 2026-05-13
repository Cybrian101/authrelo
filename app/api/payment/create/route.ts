import { NextResponse } from "next/server";
import { createOrder } from "@/lib/razorpay";
import { PRICE_AMOUNT, CURRENCY } from "@/lib/constants";

export async function POST() {
  try {
    const order = await createOrder(PRICE_AMOUNT, CURRENCY);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
