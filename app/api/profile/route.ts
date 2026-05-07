import Anthropic from "@anthropic-ai/sdk";
import { PROFILE_SYSTEM_PROMPT } from "@/lib/prompts";

const client = new Anthropic();

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const conversationText = messages
    .map(
      (m: { role: string; content: string }) =>
        `${m.role === "user" ? "Person" : "Guide"}: ${m.content}`
    )
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: PROFILE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the skill discovery conversation. Please generate the Skill Profile JSON:\n\n${conversationText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const profile = JSON.parse(text);
    return Response.json({ profile });
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const profile = JSON.parse(jsonMatch[0]);
      return Response.json({ profile });
    }
    return Response.json({ error: "Failed to parse profile" }, { status: 500 });
  }
}
