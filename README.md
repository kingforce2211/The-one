# Unlock — AI Skills Discovery Assistant

> A conversational AI app that helps individuals identify their unique skills and abilities, then shows them exactly how AI can amplify those strengths to create new things and make their lives easier.

---

## What It Does

Unlock guides users through a warm, structured conversation to surface skills they may not even realize they have — things that come naturally, knowledge they've built up, patterns others notice in them. After roughly 8–12 exchanges, it generates a personalized **Skill Profile** containing:

- **Core Skills** — with evidence drawn directly from the conversation
- **Hidden Strengths** — abilities the user likely undervalues
- **AI Opportunities** — specific, tailored ways AI can amplify *their* skill set (not generic advice)
- **Suggested Projects** — concrete things they can start building, with difficulty levels
- **Personal Affirmation** — a closing message to leave them energized and clear on their potential

---

## Approach

### Two-phase AI interaction

**Phase 1 — Discovery interview**
The AI (named "Unlock") conducts a single-question-at-a-time conversational interview. It never fires a list of questions at once. It probes across six natural areas: what the person does/has done, what comes easily to them, their knowledge depth, peak moments, motivations, and daily life skills. This is handled by a carefully crafted system prompt that instructs the model to be warm, brief, and reflective — like a brilliant coach.

**Phase 2 — Profile generation**
Once the AI has gathered enough (signaled by a `[READY_FOR_PROFILE]` token in its response), a second Claude call analyzes the full conversation transcript and outputs a structured JSON Skill Profile. This separation keeps the interview conversational and the profile generation analytical — two different cognitive modes, two different system prompts.

### Streaming
The chat API route streams Claude's response token-by-token using the Anthropic SDK's event-based `on('text', ...)` pattern, piped into a Web `ReadableStream`. The client reads chunks as they arrive and updates the UI in real time, giving the feel of a live conversation.

---

## Tools & Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack in one repo, easy Vercel deploy, native streaming support |
| Language | TypeScript | Type safety for the profile data structures |
| Styling | Tailwind CSS v4 | Utility-first, no design system overhead needed for a focused tool |
| AI | Claude (`claude-sonnet-4-6`) via Anthropic SDK | Best-in-class instruction following for the nuanced interview persona |
| Deployment | Vercel | Zero-config Next.js hosting, env vars, automatic HTTPS |

### Key files

```
app/
  page.tsx              # Chat UI + profile view (client component)
  api/chat/route.ts     # Streaming interview endpoint
  api/profile/route.ts  # Profile generation endpoint
components/
  MessageBubble.tsx     # Chat message renderer
  SkillProfile.tsx      # Full profile card view
  TypingIndicator.tsx   # Animated typing dots
lib/
  prompts.ts            # System prompts for interview and profile generation
  types.ts              # TypeScript interfaces for all data shapes
```

---

## Assumptions Made

1. **One session, no persistence.** Conversation history lives in React state only. Refreshing the page starts over. This keeps the app stateless and avoids the need for a database or auth system for a first version.

2. **The user will have an Anthropic API key.** The app is self-hosted — users supply their own key via the `ANTHROPIC_API_KEY` environment variable. There is no built-in billing or key management.

3. **8–12 exchanges is enough signal.** The system prompt targets this range as sufficient to build a meaningful profile. In practice, richer conversations produce richer profiles, but the model is instructed to transition naturally rather than at a hard cutoff.

4. **English only.** No localization was built. The prompts and UI are English-first.

5. **Single user per session.** No multi-tenancy, no user accounts. Each browser tab is an independent session.

6. **The profile is a starting point, not a verdict.** The AI profile is designed to be inspiring and directional, not clinically precise. It surfaces patterns and possibilities — the user decides what resonates.

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/kingforce2211/The-one.git
cd The-one

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key
cp .env.local.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import this repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Click Deploy

Vercel auto-detects Next.js — no build configuration needed.

---

## What's Next

Ideas for extending the app:

- **Save & share profiles** — persist the Skill Profile to a database so users can revisit or share a link
- **Follow-up sessions** — let users return and deepen their profile over time
- **Action planner** — after the profile, an AI agent that helps break down one of the suggested projects into actual steps
- **Team mode** — run discovery for a whole team and find complementary skill sets
