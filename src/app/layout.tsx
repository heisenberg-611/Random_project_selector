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
  title: "DevSpark | Random Project Idea Selector & Status Tracker",
  description:
    "Generate random project ideas across AI, Fullstack Web, DevOps, CyberSecurity, GameDev, and mobile apps when you're out of ideas. Track progress effortlessly with zero tracking and offline JSON backup.",
  keywords: [
    "project ideas",
    "random project generator",
    "coding ideas",
    "portfolio project generator",
    "developer tools",
    "project tracker",
  ],
  authors: [{ name: "DevSpark" }],
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
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
