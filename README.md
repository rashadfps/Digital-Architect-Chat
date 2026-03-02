# Digital-Architect-Chat

Digital-Arch is a website-focused AI intake + scope generation assistant.

## What is included

- **Gemini 2.5 Flash scope generation endpoint** (`app/api/generate-scope/route.ts`)
- **Reusable system prompt** for website/web-app-only behavior (`lib/ai/systemPrompt.ts`)
- **Strict Zod scope schema** (`lib/validators/scope.ts`)
- **Guided intake chat component** (`components/intake/IntakeChat.tsx`)
- **Updated 5+1 intake question set** (`components/intake/questions.ts`)
- **Scope preview page skeleton** (`app/scope/[id]/page.tsx`)

## Intake flow

1. Project type
2. Primary goal
3. Core modules/features (multi-select)
4. Priority area
5. Delivery preference
6. Timeline

> Budget is intentionally removed for a lower-friction discovery flow.

## Guardrail copy

Digital-Arch uses this onboarding/redirect style:

- “Great idea — I specialize in website and web application projects...”
- If a user is off-scope: map the idea into web modules (pages, features, users, content, integrations).

## Environment variables

Create `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Notes

- The API route validates Gemini JSON output with Zod before returning.
- Scope preview page currently expects an `/api/scope/[id]` endpoint to provide persisted scope data.
