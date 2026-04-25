import { config } from "../config";

export async function callOpenRouter(prompt: string): Promise<string | null> {
  if (!config.openRouterApiKey) return null;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`OpenRouter API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json() as any;
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("OpenRouter fetch failed:", err);
    return null;
  }
}

export function cleanJson(text: string): string {
  // Remove markdown code fences and whitespace
  return text.replace(/```json\n?|```/g, "").trim();
}
