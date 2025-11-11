import type { Metadata } from "next";
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
  title: {
    default: "AI Signals – Automated AI Intelligence Briefings",
    template: "%s – AI Signals",
  },
  description:
    "An AI-powered blog that continuously curates and synthesises the latest artificial intelligence headlines from trusted RSS feeds.",
  metadataBase: new URL("https://ai-signals.local"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AI Signals",
    description:
      "Curated briefings and deep dives on the latest in artificial intelligence.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Signals",
    description:
      "Automated AI news intelligence sourced from trusted publications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
