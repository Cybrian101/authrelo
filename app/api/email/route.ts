import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, patternName, reflection } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // Use configured SMTP or fall back to a test-friendly response
    if (!process.env.SMTP_HOST) {
      // No SMTP configured — log and return success for dev
      console.log(`[Email] Would send to ${email}: ${patternName}`);
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "AuthRelo <noreply@authrelo.com>",
      to: email,
      subject: `Your AuthRelo Reflection: ${patternName}`,
      html: `
        <div style="max-width:480px;margin:0 auto;font-family:system-ui,sans-serif;color:#F1F5F9;background:#0D1117;padding:32px;border-radius:16px;">
          <h1 style="color:#F59E0B;font-size:24px;font-weight:500;margin-bottom:8px;">AuthRelo</h1>
          <p style="color:rgba(241,245,249,0.6);font-size:14px;margin-bottom:24px;">Your relationship pattern reflection</p>
          <h2 style="color:#F59E0B;font-size:20px;font-weight:500;margin-bottom:16px;">${patternName}</h2>
          <div style="color:rgba(241,245,249,0.8);font-size:15px;line-height:1.7;white-space:pre-wrap;">${reflection}</div>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
          <p style="color:rgba(241,245,249,0.35);font-size:12px;text-align:center;">
            This email was sent because you requested it. We don't store your email address.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
