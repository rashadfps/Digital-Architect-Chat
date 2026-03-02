import type { ScopeDocument } from "../../../lib/validators/scope";

type ScopePageProps = {
  params: { id: string };
};

async function getScopeById(id: string): Promise<ScopeDocument> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/scope/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load scope");
  }

  const data = (await response.json()) as { scope: ScopeDocument };
  return data.scope;
}

export default async function ScopePage({ params }: ScopePageProps) {
  const scope = await getScopeById(params.id);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{scope.project_name}</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-2 text-sm">Edit intake</button>
          <button className="rounded border px-3 py-2 text-sm">Regenerate</button>
          <button className="rounded bg-black px-3 py-2 text-sm text-white">Export PDF</button>
        </div>
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 text-lg font-semibold">Project Summary</h2>
        <article className="prose prose-sm max-w-none whitespace-pre-wrap">{scope.preview_summary_markdown}</article>
      </section>
    </main>
  );
}
