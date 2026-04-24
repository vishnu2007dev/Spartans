import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { AppContextProvider } from "../lib/context";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Unlockd — Unlock your next opportunity",
  description: "Personalized skill roadmaps for students entering the workforce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
      style={{
        "--color-navy": "#0A0F1E",
        "--color-charcoal": "#111827",
        "--color-teal": "#00D4AA",
        "--color-amber": "#F59E0B",
        "--color-offwhite": "#F0F4FF",
      } as React.CSSProperties}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "var(--color-navy)",
          color: "var(--color-offwhite)",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
