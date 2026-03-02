import { NextRequest, NextResponse } from "next/server";
import { getScopeById, updateScope } from "../../../../lib/server/scopeStore";
import { ScopeSchema } from "../../../../lib/validators/scope";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const record = await getScopeById(params.id);
  if (!record) {
    return NextResponse.json({ error: "Scope not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = ScopeSchema.safeParse(body?.scope);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Scope validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }

    const updated = await updateScope(params.id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Scope not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Server error", detail: String(error) }, { status: 500 });
  }
}
