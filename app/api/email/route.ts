import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email, patternName, reflection } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const safePattern = escapeHtml(String(patternName || ""));
    const safeReflection = escapeHtml(String(reflection || ""));

    // No SMTP configured — log and return success for dev
    if (!process.env.SMTP_HOST) {
      console.log(`[Email] Would send to ${email}: ${safePattern}`);
      return NextResponse.json({ success: true });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("[Email] SMTP_USER or SMTP_PASS not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
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
      subject: `Your AuthRelo Reflection: ${safePattern}`,
      html: `
        <div style="max-width:480px;margin:0 auto;font-family:system-ui,sans-serif;color:#F1F5F9;background:#0D1117;padding:32px;border-radius:16px;">
          <h1 style="color:#F59E0B;font-size:24px;font-weight:500;margin-bottom:8px;">AuthRelo</h1>
          <p style="color:rgba(241,245,249,0.6);font-size:14px;margin-bottom:24px;">Your relationship pattern reflection</p>
          <h2 style="color:#F59E0B;font-size:20px;font-weight:500;margin-bottom:16px;">${safePattern}</h2>
          <div style="color:rgba(241,245,249,0.8);font-size:15px;line-height:1.7;white-space:pre-wrap;">${safeReflection}</div>
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
