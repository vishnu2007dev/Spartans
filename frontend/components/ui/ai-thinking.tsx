"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const SCROLL_CONFIG = {
  SPEED: 5,
  INITIAL_DELAY: 100,
} as const;

const TIMER_CONFIG = {
  INTERVAL: 1000,
} as const;

const DIMENSIONS = {
  CARD_HEIGHT: "150px",
  FADE_HEIGHT: "80px",
} as const;

const SHIMMER_CONFIG = {
  DURATION: "5s",
  GRADIENT:
    "linear-gradient(110deg, #404040 35%, #fff 50%, #404040 75%, #404040)",
  BACKGROUND_SIZE: "200% 100%",
} as const;

const DEFAULT_THINKING_CONTENT = `Let me analyze the document structure first. I need to identify key sections — typically resumes have contact info, summary, experience, education, and skills.

Scanning the document layout... I can see structured sections with clear headers. The formatting suggests a professional template was used. Let me extract the content section by section.

First, identifying the work experience entries. I need to parse company names, job titles, date ranges, and bullet points describing responsibilities and achievements. Each entry follows a consistent pattern.

Looking at the experience bullets more closely — I should identify quantifiable achievements (numbers, percentages, metrics) and separate them from general responsibilities. These are important for job matching later.

Now parsing the education section. I need to extract institution names, degree types, fields of study, and graduation dates. Also checking for honors, relevant coursework, and GPA if mentioned.

Moving on to skills extraction. I'm categorizing skills by type — programming languages, frameworks, tools, soft skills, certifications. I need to be careful to distinguish between skill levels (proficient vs. familiar).

Cross-referencing the skills mentioned in the experience bullets with the explicit skills section. Sometimes candidates demonstrate skills in their experience that they don't list in their skills section — I should capture those too.

Validating the extracted data against common patterns. Checking for consistency in date formats, ensuring no experience gaps are misinterpreted, and verifying that skill names are standardized.

Structuring the final output with confidence scores for each extracted field. Fields with clear, unambiguous text get high confidence. Abbreviated or ambiguous entries get flagged for human review.

Finalization: Organizing all extracted data into the structured format — skills array, experience objects with company/title/dates/highlights, and education objects with institution/degree/year.`;

function useTimer() {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, TIMER_CONFIG.INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return timer;
}

function useAutoScroll(contentRef: React.RefObject<HTMLDivElement | null>) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!contentRef.current || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const initializeScroll = () => {
      if (!contentRef.current) return;

      const { scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      intervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + 1;
          return newPosition >= maxScroll ? 0 : newPosition;
        });
      }, SCROLL_CONFIG.SPEED);
    };

    const timeoutId = setTimeout(initializeScroll, SCROLL_CONFIG.INITIAL_DELAY);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contentRef]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, contentRef]);

  return scrollPosition;
}

interface ThinkingHeaderProps {
  timer: number;
}

function ThinkingHeader({ timer, message }: ThinkingHeaderProps & { message?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Spinner aria-hidden="true" className="size-4" />
      <span className="relative inline-block animate-pulse text-sm">
        {message || "AI is thinking..."}
      </span>
      <span
        aria-label={`${timer} seconds elapsed`}
        className="text-muted-foreground text-sm"
      >
        {timer}s
      </span>
    </div>
  );
}

interface FadeOverlayProps {
  position: "top" | "bottom";
}

function FadeOverlay({ position }: FadeOverlayProps) {
  const isTop = position === "top";
  const gradientClass = isTop
    ? "bg-gradient-to-b from-background from-30% to-transparent"
    : "bg-gradient-to-t from-background from-30% to-transparent";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 ${gradientClass}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height: DIMENSIONS.FADE_HEIGHT,
      }}
    />
  );
}

interface ThinkingContentProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  content: string;
}

function ThinkingContent({ contentRef, content }: ThinkingContentProps) {
  return (
    <div
      aria-label="AI thinking process"
      aria-live="polite"
      className="h-full overflow-hidden p-4 text-secondary-foreground"
      ref={contentRef}
      role="log"
      style={{ scrollBehavior: "auto" }}
    >
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
    </div>
  );
}

interface ContentCardProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  content: string;
}

function ContentCard({ contentRef, content }: ContentCardProps) {
  return (
    <Card
      className="relative overflow-hidden rounded-xl p-2 shadow-xs"
      style={{ height: DIMENSIONS.CARD_HEIGHT }}
    >
      <FadeOverlay position="top" />
      <FadeOverlay position="bottom" />
      <ThinkingContent content={content} contentRef={contentRef} />
    </Card>
  );
}

function ShimmerStyles() {
  return (
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        [style*="shimmer"] {
          animation: none;
        }
      }
    `}</style>
  );
}

export default function AIThinking({ className, message, content }: { className?: string; message?: string; content?: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const timer = useTimer();
  useAutoScroll(contentRef);

  return (
    <div className={cn("flex max-w-xl flex-col gap-4", className)}>
      <ThinkingHeader timer={timer} message={message} />
      <ContentCard content={content || DEFAULT_THINKING_CONTENT} contentRef={contentRef} />
      <ShimmerStyles />
    </div>
  );
}
