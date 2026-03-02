import { NextRequest, NextResponse } from "next/server";
import { ScopeSchema } from "../../../lib/validators/scope";
import { createScope } from "../../../lib/server/scopeStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { intake, scope } = body as {
      intake?: Record<string, unknown>;
      scope?: unknown;
    };

    const parsed = ScopeSchema.safeParse(scope);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Scope validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }

    const record = await createScope({
      intake: intake ?? {},
      scope: parsed.data,
    });

    return NextResponse.json({ id: record.id, scope: record.scope, createdAt: record.createdAt });
  } catch (error) {
    return NextResponse.json({ error: "Server error", detail: String(error) }, { status: 500 });
  }
}
