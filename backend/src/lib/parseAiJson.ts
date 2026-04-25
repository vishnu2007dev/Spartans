/**
 * Parse model output that may be wrapped in ```json fences or have leading prose.
 */
export function parseAiJsonContent(content: string): unknown {
  let s = content.trim();
  const fenced = /```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```/im.exec(s);
  if (fenced) s = fenced[1].trim();

  try {
    return JSON.parse(s);
  } catch {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(s.slice(start, end + 1));
    }
    throw new Error("Invalid JSON from model");
  }
}
