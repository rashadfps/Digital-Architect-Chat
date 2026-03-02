# Digital-Architect-Chat

Digital-Arch is a website-focused AI intake + scope generation assistant.

## What is included

- **Gemini 2.5 Flash scope generation endpoint** (`app/api/generate-scope/route.ts`)
- **Reusable system prompt** for website/web-app-only behavior (`lib/ai/systemPrompt.ts`)
- **Strict Zod scope schema** (`lib/validators/scope.ts`)
- **Guided intake chat component** (`components/intake/IntakeChat.tsx`)
- **Updated 5+1 intake question set** (`components/intake/questions.ts`)
- **Scope persistence API + file store** (`app/api/scope/route.ts`, `app/api/scope/[id]/route.ts`, `lib/server/scopeStore.ts`)
- **Scope preview page** (`app/scope/[id]/page.tsx`)

## End-to-end flow available now

1. Open `/new-project`
2. Complete intake questions
3. Click generate to call Gemini
4. Output is schema-validated and saved
5. User is redirected to `/scope/:id` preview

## Intake flow

1. Project type
2. Primary goal
3. Core modules/features (multi-select)
4. Priority area
5. Delivery preference
6. Timeline

> Budget is intentionally removed for a lower-friction discovery flow.

## Environment variables

Create `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
```

## Notes

- Scope data is stored in `data/scopes.json` for local development.
- Replace file storage with Postgres/Prisma for production.
