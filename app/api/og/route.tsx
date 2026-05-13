import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pattern = searchParams.get("pattern") || "Your Pattern";
  const line = searchParams.get("line") || "Discover yours at authrelo.com";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1117",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Brand */}
        <div
          style={{
            fontSize: "28px",
            color: "#F59E0B",
            fontWeight: 500,
            letterSpacing: "-0.5px",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          AuthRelo
        </div>

        {/* Pattern name */}
        <div
          style={{
            fontSize: "48px",
            color: "#F59E0B",
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          {pattern}
        </div>

        {/* Preview line */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(241,245,249,0.6)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          {line}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "16px",
            color: "rgba(241,245,249,0.35)",
            display: "flex",
          }}
        >
          authrelo.com — Are you really listening to yourself?
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
