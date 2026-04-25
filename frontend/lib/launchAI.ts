export type AITarget = "chatgpt" | "claude" | "gemini" | "copy";

export async function launchWithPrompt(
  prompt: string,
  target: AITarget
): Promise<{ success: boolean; message?: string }> {
  try {
    if (target === "copy") {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        return { success: false, message: "Select and copy the text above" };
      }
      await navigator.clipboard.writeText(prompt);
      return { success: true, message: "Copied!" };
    }

    if (typeof window === "undefined") return { success: false };

    const q = encodeURIComponent(prompt);
    const url =
      target === "chatgpt"
        ? `https://chatgpt.com/?q=${q}`
        : target === "claude"
          ? `https://claude.ai/new?q=${q}`
          : `https://gemini.google.com/app?q=${q}`;

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      return {
        success: false,
        message: "Please allow popups for this site, or copy the prompt instead",
      };
    }
    return { success: true };
  } catch {
    if (target === "copy") return { success: false, message: "Copy failed" };
    return { success: false };
  }
}

