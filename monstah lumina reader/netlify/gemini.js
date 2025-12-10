// netlify/functions/gemini.js

// This is a Netlify serverless function.
// Your React app will call THIS instead of talking to Gemini directly.

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    // Read JSON sent from the browser: { "prompt": "..." }
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: "Missing 'prompt' in request body",
      };
    }

    // Get your Gemini API key from an environment variable (in Netlify)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: "Server error: missing GEMINI_API_KEY",
      };
    }

    // Call the Google Gemini REST API
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
        body: "Gemini API error: " + response.status,
      };
    }

    const data = await response.json();

    // Pull the model's text out of the response
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer from model.";

    // Send JSON back to the browser: { "text": "the answer..." }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: "Server error",
    };
  }
};