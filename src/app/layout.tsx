import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEVSPARK // SYS_ORACLE - Random Project Idea Matrix & Tracker",
  description:
    "Autonomous software project matrix & real-time AI synthesis engine across 10 modern technical sectors. Track progress effortlessly with zero telemetry and offline JSON backup.",
  keywords: [
    "project ideas",
    "random project generator",
    "coding ideas",
    "portfolio project generator",
    "developer tools",
    "project tracker",
    "AI project synthesis",
  ],
  authors: [{ name: "DevSpark" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
