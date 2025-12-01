// netlify/functions/gemini.js

// Netlify serverless function:
// - Receives { prompt } from the browser
// - Calls Google's Gemini API using GEMINI_API_KEY
// - Returns { text } or { error }

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: "Missing 'prompt' in request body",
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Server error: missing GEMINI_API_KEY" }),
      };
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Gemini API error ${response.status}: ${errorText}`,
        }),
      };
    }

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer from model.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};