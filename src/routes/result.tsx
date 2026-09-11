import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Prediction result — Veridia" },
      {
        name: "description",
        content: "The latest REAL or FAKE prediction with confidence score and model details.",
      },
      { property: "og:title", content: "Prediction result — Veridia" },
      {
        property: "og:description",
        content: "The latest REAL or FAKE prediction with confidence score and model details.",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { history } = useAppState();
  const latest = history[0];
  const good = latest.verdict === "REAL";

  return (
    <PageShell>
      <section className="animate-rise grid gap-5 pt-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-white ring-1 ring-black/10">
            <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-verify/25 blur-3xl" />
            <span className="relative font-mono text-[11px] tracking-widest text-white/50 uppercase">
              Prediction result
            </span>
            <h1
              className={`relative mt-3 font-display text-6xl font-bold tracking-tight ${good ? "text-good" : "text-bad"}`}
            >
              {latest.verdict}
            </h1>
            <p className="relative mt-4 max-w-[46ch] text-sm leading-relaxed text-white/70">
              “{latest.headline}”
            </p>
            <div className="relative mt-7">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-widest text-white/50 uppercase">
                  Confidence
                </span>
                <span className="font-display text-4xl font-bold tracking-tight">
                  {latest.confidence}%
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`animate-grow h-full origin-left rounded-full ${good ? "bg-good" : "bg-bad"}`}
                  style={{ width: `${latest.confidence}%` }}
                />
              </div>
            </div>
            <div className="relative mt-6 border-t border-white/10 pt-5">
              <Link
                to="/check"
                className="rounded-xl bg-verify px-4 py-2.5 text-sm font-medium text-verify-ink transition-transform duration-200 hover:-translate-y-0.5"
              >
                Check another
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel h-full rounded-2xl p-5 ring-1 ring-line">
            <h2 className="font-display text-lg font-semibold tracking-tight">How it was scored</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <Row label="Pipeline" value="Clean · tokenise · stopwords · TF-IDF" />
              <Row label="Classifier" value="Logistic Regression (scikit-learn)" />
              <Row label="Checked by" value={latest.user} />
              <Row label="Recorded at" value={latest.time} />
            </dl>
            <p className="mt-5 border-t border-line/70 pt-4 text-sm leading-relaxed text-muted">
              A confidence below 60% means the model is unsure — treat the verdict as advisory and
              confirm with a trusted source.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] tracking-widest text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}
