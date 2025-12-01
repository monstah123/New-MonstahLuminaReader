// services/netlifyGemini.ts

export async function askGemini(prompt: string): Promise<string> {
  const res = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const text = await res.text(); // read body as text for debugging

  if (!res.ok) {
    // Log full error to browser console
    console.error("Function error response:", res.status, text);
    throw new Error(`Request failed ${res.status}: ${text}`);
  }

  // Try to parse JSON if possible
  try {
    const data = JSON.parse(text);
    return data.text || data.error || "No text in response";
  } catch {
    // If it's not JSON, just return raw text
    return text || "No text in response";
  }
}