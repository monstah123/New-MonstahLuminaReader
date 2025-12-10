// services/api.ts

export async function sendMessage(
  prompt: string,
  voiceName: string
): Promise<string> {
  const response = await fetch("/.netlify/functions/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, voiceName }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request to Netlify function failed");
  }

  if (!data.audio) {
    throw new Error("No audio data returned from server");
  }

  return data.audio as string; // base64 audio
}