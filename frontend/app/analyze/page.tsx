"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Replaced by /onboarding in Phase 3
export default function AnalyzePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/onboarding"); }, [router]);
  return null;
}
