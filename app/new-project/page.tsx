import { IntakeChat } from "../../components/intake/IntakeChat";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Start a new Digital-Arch scope</h1>
        <p className="text-sm text-muted-foreground">
          Answer the guided intake and generate a website-focused scope document preview.
        </p>
      </header>
      <IntakeChat />
    </main>
  );
}
