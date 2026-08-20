# Unlock — Approach, Tools & Assumptions

This document describes the design decisions, technical choices, and assumptions behind the **Unlock** AI Skills Discovery Assistant.

---

## The Problem Being Solved

Most people have skills they can't clearly articulate — things that come naturally, knowledge built over years, patterns others notice but they take for granted. At the same time, AI is transforming what's possible for individuals, but most people don't know how it applies to *them specifically*.

Unlock bridges that gap: it draws out what makes a person unique, then maps those specifics to concrete AI-powered opportunities.

---

## Approach

### Two-Phase AI Design

The app splits the work into two distinct AI interactions, each with its own system prompt and purpose.

**Phase 1 — Conversational Discovery Interview**

An AI guide named "Unlock" conducts a warm, one-question-at-a-time interview. The conversation moves naturally through six areas:

1. What the person does / has done (work, hobbies, volunteering, side projects)
2. What comes naturally to them — what others ask them for help with
3. Knowledge depth — subjects they've gone deep on
4. Peak moments — proudest accomplishments, times they felt most effective
5. Values and motivations — what excites them, what they'd do unpaid
6. Daily life skills — organization, communication, problem-solving

The AI is explicitly instructed to never fire multiple questions at once, never produce bullet lists mid-conversation, and keep each response under 100 words. The goal is for the user to feel genuinely heard — not assessed.

**Phase 2 — Structured Profile Generation**

Once the interview has enough signal (8–12 exchanges), the AI signals readiness with a `[READY_FOR_PROFILE]` token. A second, separate Claude call then receives the full conversation transcript and outputs a structured JSON Skill Profile. This call uses a completely different system prompt — analytical rather than conversational — and is optimized for producing accurate, specific, non-generic output.

Separating the two phases matters because combining them in one prompt would compromise both: the interview would feel clinical and the profile would be less precise.

### Streaming

The chat API streams Claude's response token-by-token. The Anthropic SDK's `on('text', ...)` event pattern pipes text into a Web `ReadableStream`, which the client reads chunk-by-chunk and renders in real time. This gives the experience of watching someone type — essential for a conversational product.

### Signal Marker Pattern

Rather than relying on message count or a separate API call to decide when to transition to profile generation, the AI itself signals readiness inline via `[READY_FOR_PROFILE]`. The client detects this token in the stream and shows a "Generate My Skill Profile" button. This keeps the transition natural and driven by conversation quality, not arbitrary turn counts.

---

## Tools Used

| Layer | Tool / Library | Version | Why |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 | Full-stack in one repo; streaming API routes; one-command Vercel deploy |
| Language | TypeScript | 5.x | Strongly typed profile data structures catch shape mismatches at compile time |
| Styling | Tailwind CSS | v4 | Utility-first; no component library overhead for a tightly scoped UI |
| AI Model | Claude (`claude-sonnet-4-6`) | — | Strong instruction-following for the interview persona; reliable JSON output for profiles |
| AI SDK | `@anthropic-ai/sdk` | 0.95.x | Official SDK with streaming helpers and typed response shapes |
| Hosting | Vercel | — | Zero-config Next.js deployment; environment variable management; automatic HTTPS |
| Runtime | Node.js | 22.x | Required by the Anthropic SDK for streaming in the API routes |

### Key Files

```
app/
  page.tsx                 Chat UI, message state, profile display (client component)
  api/
    chat/route.ts          Streaming interview endpoint — calls Phase 1 Claude
    profile/route.ts       Profile generation endpoint — calls Phase 2 Claude

components/
  MessageBubble.tsx        Renders individual chat messages (user + assistant)
  SkillProfile.tsx         Full Skill Profile card with all sections
  TypingIndicator.tsx      Animated three-dot typing indicator

lib/
  prompts.ts               System prompts for both Phase 1 and Phase 2
  types.ts                 TypeScript interfaces: Message, SkillProfileData, etc.
```

---

## Assumptions Made

**1. No persistence needed for a first version.**
Conversation history lives in React component state. Refreshing the page starts a new session. This eliminates the need for a database, authentication, or session management — keeping the stack simple and the surface area small.

**2. The operator supplies the API key.**
`ANTHROPIC_API_KEY` is set as a server environment variable. There is no user-facing key input, billing layer, or usage metering. This assumes the app is either self-hosted or deployed by someone with their own Anthropic account.

**3. 8–12 exchanges produces enough signal for a meaningful profile.**
This range was chosen based on the depth of information typically surfaced across the six interview areas. The model is instructed to transition naturally when it has a rich enough picture — not at a hard cutoff — so shorter or longer conversations are both handled gracefully.

**4. English only.**
All system prompts, UI copy, and profile output are English-first. No localization infrastructure was built.

**5. One user per session, one session per tab.**
There is no multi-tenancy, no user accounts, and no shared state between tabs or devices. Each browser tab is a completely independent session.

**6. The Skill Profile is directional, not definitive.**
The profile is designed to be inspiring and thought-provoking rather than clinically precise. It surfaces patterns and possibilities based on a short conversation. The user is expected to apply their own judgment about what resonates.

**7. The AI will follow the interview protocol reliably.**
The system prompt assumes `claude-sonnet-4-6` will respect constraints like "one question at a time" and "no bullet lists." This holds in practice but is a model behavior assumption, not a code-enforced guarantee.

---

## What Was Deliberately Left Out

- **User accounts / auth** — not needed for a conversational tool with no saved state
- **Analytics or logging** — out of scope; no conversation data is stored
- **Multiple language support** — deferred; English covers the initial use case
- **Rate limiting** — left to the hosting environment (Vercel) and Anthropic's own limits
- **Mobile app** — the web app is responsive and works on mobile browsers

---

## Possible Next Steps

| Feature | What it unlocks |
|---|---|
| Save & share profiles | Users can revisit their profile or send it to others |
| Follow-up sessions | Deepen the profile over multiple conversations |
| Action planner | Break a suggested project into concrete weekly steps |
| Team mode | Discover complementary skill sets across a group |
| Export to PDF | Shareable artifact for job applications, coaching sessions |
