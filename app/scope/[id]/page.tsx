import { notFound } from "next/navigation";
import { getScopeById } from "../../../lib/server/scopeStore";

type ScopePageProps = {
  params: { id: string };
};

export default async function ScopePage({ params }: ScopePageProps) {
  const record = await getScopeById(params.id);

  if (!record) {
    notFound();
  }

  const { scope } = record;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{scope.project_name}</h1>
          <p className="text-sm text-gray-600">Updated: {new Date(record.updatedAt).toLocaleString()}</p>
        </div>
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

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Business Goal</h3>
          <p className="text-sm">{scope.primary_goal}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Target Audience</h3>
          <ul className="list-disc pl-5 text-sm">
            {scope.target_audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
