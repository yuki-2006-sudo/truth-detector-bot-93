import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veridia — Fake News Detection with ML & NLP" },
      {
        name: "description",
        content:
          "Paste a headline or article and get a REAL or FAKE verdict with a confidence score, powered by a TF-IDF NLP pipeline.",
      },
      { property: "og:title", content: "Veridia — Fake News Detection with ML & NLP" },
      {
        property: "og:description",
        content:
          "Check any news headline and see a REAL or FAKE verdict with confidence, history and admin analytics.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { history } = useAppState();
  const latest = history[0];

  return (
    <PageShell>
      <section className="grid gap-5 pt-10 md:grid-cols-12 md:pt-14">
        <div className="animate-rise md:col-span-7">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-verify uppercase">
            <span className="inline-block size-1.5 rounded-full bg-verify" /> Final-year CSE · NLP
          </div>
          <h1 className="mt-5 max-w-[22ch] text-balance font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl">
            Read the claim.
            <br />
            Verify the source.
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-muted">
            Veridia scores headlines and full articles with a scikit-learn NLP pipeline, returning a
            REAL or FAKE verdict with a calibrated confidence. Built on Flask, TF-IDF, and MySQL.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/check"
              className="rounded-xl bg-verify px-5 py-3 text-sm font-medium text-verify-ink ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Check a headline
            </Link>
            <Link
              to="/admin"
              className="glass-inner rounded-xl px-5 py-3 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-white/80"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="animate-fade md:col-span-5 [animation-delay:120ms]">
          <div className="glass-panel rounded-2xl p-3 ring-1 ring-line">
            <div className="flex items-center justify-between px-2 pt-1 font-mono text-[11px] tracking-widest text-muted uppercase">
              <span>Live verdict</span>
              <span className="text-verify">TF-IDF v2.1</span>
            </div>
            <div className="glass-inner mt-2 rounded-xl p-4 ring-1 ring-line">
              <p className="font-display text-[15px] leading-snug font-medium text-ink">
                “{latest.headline}”
              </p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[11px] tracking-widest text-muted uppercase">
                    Verdict
                  </div>
                  <div
                    className={`font-display text-2xl font-bold tracking-tight ${latest.verdict === "REAL" ? "text-good" : "text-bad"}`}
                  >
                    {latest.verdict}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-medium text-ink">
                    {latest.confidence}%
                  </div>
                  <div className="font-mono text-[11px] tracking-widest text-muted uppercase">
                    confidence
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className={`h-full rounded-full ${latest.verdict === "REAL" ? "bg-good" : "bg-bad"}`}
                  style={{ width: `${latest.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="animate-rise mt-6 grid gap-5 md:grid-cols-3 [animation-delay:200ms]">
        {[
          {
            n: "01",
            title: "Enter the news",
            body: "Paste a headline or a full article into the input page and press Check News.",
          },
          {
            n: "02",
            title: "Model scores it",
            body: "Text is cleaned, vectorised with TF-IDF and classified by a trained model.",
          },
          {
            n: "03",
            title: "Read the verdict",
            body: "You get REAL or FAKE with a confidence percentage, saved to your history.",
          },
        ].map((step) => (
          <div key={step.n} className="glass-panel rounded-2xl p-5 ring-1 ring-line">
            <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
              {step.n}
            </span>
            <h2 className="mt-2 font-display text-lg font-semibold tracking-tight">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
