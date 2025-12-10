// services/netlifyGemini.ts

export async function askGemini(prompt: string): Promise<string> {
  const res = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Request failed with status " + res.status);
  }

  const data = await res.json();
  return data.text || "No text in response";
}