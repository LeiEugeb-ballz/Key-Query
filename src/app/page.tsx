"use client";

import { useState } from "react";

interface TestResult {
  status: string;
  message?: string;
  metadata?: {
    provider: string;
    created: string;
    usable: boolean;
    models?: number;
  };
}

const providers = [
  { name: "Auto-detect", value: "" },
  { name: "OpenAI", value: "openai" },
  { name: "Anthropic", value: "anthropic" },
  { name: "Google (Gemini)", value: "google" },
  { name: "xAI (Grok)", value: "xai" },
  { name: "Mistral", value: "mistral" },
  { name: "Meta (Llama)", value: "meta" },
  { name: "Cohere", value: "cohere" },
  { name: "Hugging Face", value: "huggingface" },
  { name: "Replicate", value: "replicate" },
  { name: "Together AI", value: "together" },
  { name: "Anyscale", value: "anyscale" },
  { name: "Fireworks AI", value: "fireworks" },
  { name: "DeepInfra", value: "deepinfra" },
  { name: "Stability AI", value: "stability" },
  { name: "Runway ML", value: "runway" },
  { name: "ElevenLabs", value: "elevenlabs" },
  { name: "OpenRouter", value: "openrouter" },
  { name: "Midjourney", value: "midjourney" },
  { name: "DALL-E (OpenAI)", value: "dalle" },
];

export default function Home() {
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: "unreachable", message: "Failed to connect" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-6">API Key Tester</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Provider (optional)</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {providers.map((p) => (
                <option key={p.value} value={p.value} className="text-black">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleTest}
            disabled={!apiKey || loading}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </>
            ) : (
              "TEST"
            )}
          </button>
        </div>
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-white/20 text-white">
            <h2 className="font-bold mb-2">Result:</h2>
            <p>Status: {result.status}</p>
            {result.message && <p>Message: {result.message}</p>}
            {result.metadata && (
              <div>
                <p>Provider: {result.metadata.provider}</p>
                <p>Created: {result.metadata.created}</p>
                <p>Usable: {result.metadata.usable ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
