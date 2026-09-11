import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { VerdictBadge } from "@/components/VerdictBadge";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis history — Veridia" },
      {
        name: "description",
        content: "Every headline you have checked, with its REAL or FAKE verdict and confidence.",
      },
      { property: "og:title", content: "Analysis history — Veridia" },
      {
        property: "og:description",
        content: "Every headline you have checked, with its verdict and confidence.",
      },
    ],
  }),
  component: HistoryPage,
});

const filters = ["ALL", "REAL", "FAKE"] as const;

function HistoryPage() {
  const { history } = useAppState();
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const rows = history.filter((h) => filter === "ALL" || h.verdict === filter);

  return (
    <PageShell>
      <section className="animate-rise pt-10">
        <div className="glass-panel rounded-2xl p-5 ring-1 ring-line">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-lg font-semibold tracking-tight">Analysis history</h1>
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase transition-colors ${
                    filter === f ? "bg-ink text-verify-ink" : "text-muted ring-1 ring-line"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  <th className="pb-2 font-normal">Headline</th>
                  <th className="pb-2 font-normal">Verdict</th>
                  <th className="pb-2 font-normal">Conf.</th>
                  <th className="pb-2 font-normal">User</th>
                  <th className="pb-2 text-right font-normal">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-ink/5">
                    <td className="max-w-[280px] truncate py-3 pr-4 text-ink">{row.headline}</td>
                    <td>
                      <VerdictBadge verdict={row.verdict} />
                    </td>
                    <td className="font-mono text-[13px] text-ink">{row.confidence}%</td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-muted">{row.user}</td>
                    <td className="py-3 text-right font-mono text-[12px] text-muted">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-mono text-[11px] tracking-widest text-muted uppercase">
            {rows.length} record{rows.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
