import { NextResponse } from "next/server";

function detectProvider(apiKey: string): string | null {
  if (apiKey.startsWith("sk-")) {
    if (apiKey.startsWith("sk-ant-")) return "anthropic";
    if (apiKey.startsWith("sk-or-")) return "openrouter";
    return "openai";
  }
  if (apiKey.startsWith("AIza")) return "google";
  if (apiKey.startsWith("hf_")) return "huggingface";
  if (apiKey.startsWith("r8_")) return "replicate";
  if (apiKey.startsWith("sk-")) return "openai"; // fallback
  // Add more detections as needed
  return null;
}

async function testKey(provider: string, apiKey: string) {
  switch (provider) {
    case "openai":
      return await testOpenAI(apiKey);
    case "anthropic":
      return await testAnthropic(apiKey);
    case "google":
      return await testGoogle(apiKey);
    case "xai":
      return await testXAI(apiKey);
    case "mistral":
      return await testMistral(apiKey);
    case "huggingface":
      return await testHuggingFace(apiKey);
    case "replicate":
      return await testReplicate(apiKey);
    case "together":
      return await testTogether(apiKey);
    // Add more cases
    default:
      return { status: "error", message: "Provider not supported" };
  }
}

async function testOpenAI(apiKey: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        status: "successful",
        metadata: {
          provider: "OpenAI",
          created: "N/A",
          usable: true,
          models: data.data?.length || 0,
        },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else if (res.status === 429) {
      return { status: "insufficient credits", message: "Rate limited or insufficient credits" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testAnthropic(apiKey: string) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });
    if (res.ok) {
      return {
        status: "successful",
        metadata: { provider: "Anthropic", created: "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else if (res.status === 429) {
      return { status: "insufficient credits", message: "Rate limited or insufficient credits" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testGoogle(apiKey: string) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      return {
        status: "successful",
        metadata: {
          provider: "Google",
          created: "N/A",
          usable: true,
          models: data.models?.length || 0,
        },
      };
    } else if (res.status === 400) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testXAI(apiKey: string) {
  try {
    const res = await fetch("https://api.x.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      return {
        status: "successful",
        metadata: { provider: "xAI", created: "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testMistral(apiKey: string) {
  try {
    const res = await fetch("https://api.mistral.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      return {
        status: "successful",
        metadata: { provider: "Mistral", created: "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testHuggingFace(apiKey: string) {
  try {
    const res = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        status: "successful",
        metadata: { provider: "Hugging Face", created: data.createdAt || "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testReplicate(apiKey: string) {
  try {
    const res = await fetch("https://api.replicate.com/v1/models", {
      headers: { Authorization: `Token ${apiKey}` },
    });
    if (res.ok) {
      return {
        status: "successful",
        metadata: { provider: "Replicate", created: "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

async function testTogether(apiKey: string) {
  try {
    const res = await fetch("https://api.together.xyz/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      return {
        status: "successful",
        metadata: { provider: "Together AI", created: "N/A", usable: true },
      };
    } else if (res.status === 401) {
      return { status: "invalid", message: "Invalid API key" };
    } else {
      return { status: "unreachable", message: `HTTP ${res.status}` };
    }
  } catch (error) {
    return { status: "unreachable", message: "Network error" };
  }
}

export async function POST(request: Request) {
  const { provider, apiKey } = await request.json();
  let detectedProvider = provider;
  if (!detectedProvider) {
    detectedProvider = detectProvider(apiKey);
  }
  if (!detectedProvider) {
    return NextResponse.json({ status: "error", message: "Could not detect provider from API key" });
  }
  const result = await testKey(detectedProvider, apiKey);
  return NextResponse.json(result);
}