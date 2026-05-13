import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuthRelo — Are you really listening to yourself?",
  description:
    "Anonymous AI-powered relationship self-reflection. Answer 5 questions. See the pattern you can't see from inside it.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
  openGraph: {
    title: "AuthRelo",
    description: "Are you really listening — to yourself?",
    type: "website",
    locale: "en_IN",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F59E0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ServiceWorkerRegistrar />
        <ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
