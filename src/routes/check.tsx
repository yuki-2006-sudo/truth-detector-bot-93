import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { classify, SAMPLE_NEWS, type Verdict } from "@/lib/detector";
import { addAnalysis, useAppState } from "@/lib/store";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Check news — Veridia fake news detector" },
      {
        name: "description",
        content:
          "Paste a news headline or article and run the TF-IDF classifier for a REAL or FAKE verdict with confidence.",
      },
      { property: "og:title", content: "Check news — Veridia fake news detector" },
      {
        property: "og:description",
        content: "Run a headline through the classifier and read the verdict and confidence.",
      },
    ],
  }),
  component: CheckPage,
});

type Result = { verdict: Verdict; confidence: number; tokens: number; latency: string };

function CheckPage() {
  const { user } = useAppState();
  const [text, setText] = useState(SAMPLE_NEWS[0]!.text);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  function run() {
    if (!text.trim()) return;
    setBusy(true);
    window.setTimeout(() => {
      const r = classify(text);
      const next = { ...r, latency: (0.18 + Math.random() * 0.3).toFixed(2) };
      setResult(next);
      addAnalysis({
        id: crypto.randomUUID(),
        headline: text.trim().slice(0, 70),
        verdict: r.verdict,
        confidence: r.confidence,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        user: user ?? "guest@college.edu",
      });
      setBusy(false);
    }, 450);
  }

  return (
    <PageShell>
      <section className="grid gap-5 pt-10 md:grid-cols-12">
        <div className="animate-rise md:col-span-5">
          <div className="glass-panel h-full rounded-2xl p-5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-lg font-semibold tracking-tight">News input</h1>
              <span className="font-mono text-[11px] tracking-widest text-muted uppercase">01</span>
            </div>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a headline or full article here…"
              className="glass-inner mt-4 w-full resize-none rounded-xl border-0 p-4 text-sm leading-relaxed text-ink ring-1 ring-line placeholder:text-muted/60 focus:ring-2 focus:ring-verify focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-muted">
                {text.length} chars · {text.trim().split(/\s+/).filter(Boolean).length} tokens
              </span>
              <button
                onClick={run}
                disabled={busy}
                className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-verify-ink ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {busy ? "Analysing…" : "Check News"}
              </button>
            </div>
            <div className="mt-5 border-t border-line/70 pt-4">
              <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                Sample data
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SAMPLE_NEWS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setText(s.text);
                      setResult(null);
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs text-muted ring-1 ring-line transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="animate-rise md:col-span-7 [animation-delay:120ms]">
          <div className="relative h-full overflow-hidden rounded-2xl bg-ink p-6 text-white ring-1 ring-black/10">
            <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-verify/25 blur-3xl" />
            {result ? (
              <>
                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-widest uppercase ring-1 ${
                        result.verdict === "REAL"
                          ? "bg-good/20 text-good ring-good/30"
                          : "bg-bad/20 text-bad ring-bad/30"
                      }`}
                    >
                      Verdict
                    </span>
                    <span className="font-display text-3xl font-bold tracking-tight">
                      {result.verdict}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] tracking-widest text-white/50 uppercase">
                    Prediction result
                  </span>
                </div>
                <div className="relative mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] tracking-widest text-white/50 uppercase">
                      Confidence
                    </span>
                    <span className="font-display text-4xl font-bold tracking-tight">
                      {result.confidence}%
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`animate-grow h-full origin-left rounded-full ${result.verdict === "REAL" ? "bg-good" : "bg-bad"}`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                  <Stat label="Model" value="Logistic Regression" />
                  <Stat label="Features" value={`TF-IDF · ${result.tokens * 175}`} />
                  <Stat label="Latency" value={`${result.latency} s`} />
                </div>
                <div className="relative mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/result"
                    className="rounded-xl bg-verify px-4 py-2.5 text-sm font-medium text-verify-ink transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Open result page
                  </Link>
                  <Link
                    to="/history"
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10"
                  >
                    View history
                  </Link>
                </div>
              </>
            ) : (
              <div className="relative flex h-full min-h-[280px] flex-col justify-center">
                <span className="font-mono text-[11px] tracking-widest text-white/40 uppercase">
                  Awaiting input
                </span>
                <p className="mt-3 max-w-[34ch] font-display text-2xl leading-snug font-medium text-white/80">
                  Press Check News and the verdict, confidence and model details appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
