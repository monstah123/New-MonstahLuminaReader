import { useState } from "react";
import { askGemini } from "./services/netlifyGemini";

function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const text = await askGemini(prompt);
      setAnswer(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 12 }}>
      <h1>MONSTAH LUMINA READER</h1>

      <textarea
        style={{ width: "100%", height: 120 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Gemini something..."
      />

      <br />
      <button onClick={handleAsk} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Answer</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 10 }}>
        {answer}
      </pre>
    </main>
  );
}

export default App;