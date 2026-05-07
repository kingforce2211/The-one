import Anthropic from "@anthropic-ai/sdk";
import { DISCOVERY_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("ANTHROPIC_API_KEY is not set.", { status: 500 });
    }

    const { messages } = await req.json();

    // Anthropic API requires conversations to start with a user message
    const apiMessages = [...messages];
    while (apiMessages.length > 0 && apiMessages[0].role === "assistant") {
      apiMessages.shift();
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const encoder = new TextEncoder();

    const sdkStream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: DISCOVERY_SYSTEM_PROMPT,
      messages: apiMessages,
    });

    const readable = new ReadableStream({
      start(controller) {
        sdkStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });
        sdkStream.on("finalMessage", () => {
          controller.close();
        });
        sdkStream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        sdkStream.abort();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}
