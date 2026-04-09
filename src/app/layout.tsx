import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProCoder — Kids Learning Platform",
    template: "%s | ProCoder",
  },
  description:
    "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18",
  keywords: [
    "kids coding",
    "children programming",
    "robotics for kids",
    "quran learning",
    "arabic for kids",
    "algorithms",
    "online learning platform",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
