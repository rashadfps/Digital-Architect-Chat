"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { intakeQuestions, WEBSITE_ONLY_GUARDRAIL, type IntakeAnswers } from "./questions";

type GenerateScopeResponse = {
  scope?: unknown;
  error?: string;
};

type SaveScopeResponse = {
  id?: string;
  error?: string;
};

export function IntakeChat() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const current = intakeQuestions[step];
  const isDone = step >= intakeQuestions.length;

  const shouldAskFollowUp = useMemo(() => {
    const value = answers[current?.id];
    if (Array.isArray(value)) {
      return value.includes("Other") || value.includes("Not sure");
    }
    return value === "Other" || value === "Not sure";
  }, [answers, current?.id]);

  const saveSingle = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const toggleMulti = (value: string) => {
    setAnswers((prev) => {
      const currentValue = (prev[current.id] as string[] | undefined) ?? [];
      const next = currentValue.includes(value)
        ? currentValue.filter((item) => item !== value)
        : [...currentValue, value];
      return { ...prev, [current.id]: next };
    });
  };

  const next = async () => {
    if (!current) {
      await generateScope();
      return;
    }

    if (shouldAskFollowUp && followUp.trim()) {
      setAnswers((prev) => ({ ...prev, followUp: followUp.trim() }));
    }

    setFollowUp("");
    setStep((prev) => prev + 1);
  };

  const generateScope = async () => {
    setLoading(true);
    setResult("");

    const payload = {
      messages: [
        { role: "assistant", content: WEBSITE_ONLY_GUARDRAIL },
        { role: "user", content: "Generate scope from intake answers." },
      ],
      intake: answers,
    };

    try {
      const res = await fetch("/api/generate-scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as GenerateScopeResponse;
      if (!res.ok || !data.scope) {
        throw new Error(data.error ?? "Failed to generate scope");
      }

      const saveRes = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: answers, scope: data.scope }),
      });

      const saved = (await saveRes.json()) as SaveScopeResponse;
      if (!saveRes.ok || !saved.id) {
        throw new Error(saved.error ?? "Failed to save scope");
      }

      router.push(`/scope/${saved.id}`);
    } catch (error) {
      setResult(String(error));
    } finally {
      setLoading(false);
    }
  };

  if (isDone) {
    return (
      <section className="space-y-4 rounded-lg border p-5">
        <p className="text-sm text-muted-foreground">{WEBSITE_ONLY_GUARDRAIL}</p>
        <button className="rounded bg-black px-4 py-2 text-white" onClick={generateScope} disabled={loading}>
          {loading ? "Generating..." : "Generate Scope"}
        </button>
        {result ? <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-white">{result}</pre> : null}
      </section>
    );
  }

  const value = answers[current.id];
  const selected = Array.isArray(value) ? value : [];

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <p className="text-sm text-muted-foreground">{WEBSITE_ONLY_GUARDRAIL}</p>
      <h2 className="text-lg font-semibold">{current.label}</h2>
      <div className="flex flex-wrap gap-2">
        {current.options.map((option) => {
          const active = current.multi ? selected.includes(option) : value === option;

          return (
            <button
              key={option}
              onClick={() => (current.multi ? toggleMulti(option) : saveSingle(option))}
              className={`rounded-full border px-3 py-1 text-sm ${active ? "bg-black text-white" : "bg-white"}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {shouldAskFollowUp ? (
        <label className="block">
          <span className="mb-1 block text-sm">Add a short clarification:</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
            placeholder="Describe your preference..."
          />
        </label>
      ) : null}

      <button className="rounded bg-black px-4 py-2 text-white" onClick={next} disabled={loading}>
        {loading ? "Working..." : "Next"}
      </button>
      {result ? <p className="text-sm text-red-600">{result}</p> : null}
    </section>
  );
}
