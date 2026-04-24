"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Replaced by /score in Phase 5
export default function ResultsPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/score"); }, [router]);
  return null;
}
