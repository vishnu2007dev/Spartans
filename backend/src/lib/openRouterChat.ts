import { config } from "../config";

/**
 * Single user message + JSON mode — matches how assessment route reduces parse failures.
 */
export async function completeOpenRouterUserJson(
  prompt: string
): Promise<string | null> {
  const apiKey = config.openRouterApiKey;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.warn("[OpenRouter] HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.warn("[OpenRouter] request failed:", e);
    return null;
  }
}
