"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavProps {
  landing?: boolean;
}

export function Nav({ landing = false }: NavProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5 lg:px-8"
      >
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* SVG logomark */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              width="22"
              height="22"
              rx="6"
              fill="var(--accent)"
              fillOpacity="0.15"
            />
            <rect
              width="22"
              height="22"
              rx="6"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <path
              d="M6.5 11.5L9.5 14.5L15.5 8"
              stroke="var(--accent)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ color: "var(--heading)" }}
          >
            Unlockd
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun
              className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              aria-hidden="true"
            />
          </Button>
          {landing && (
            <Button size="sm" asChild>
              <Link href="/onboarding">Get started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
