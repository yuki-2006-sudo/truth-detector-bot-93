import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { VerdictBadge } from "@/components/VerdictBadge";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Veridia" },
      {
        name: "description",
        content:
          "Admin view with REAL vs FAKE totals, weekly check volume and the latest classified headlines.",
      },
      { property: "og:title", content: "Admin dashboard — Veridia" },
      {
        property: "og:description",
        content: "REAL vs FAKE totals, weekly volume and the latest classified headlines.",
      },
    ],
  }),
  component: AdminPage,
});

const weekly = [
  { day: "Mon", real: 18, fake: 10 },
  { day: "Tue", real: 24, fake: 20 },
  { day: "Wed", real: 31, fake: 12 },
  { day: "Thu", real: 20, fake: 18 },
  { day: "Fri", real: 35, fake: 22 },
  { day: "Sat", real: 12, fake: 12 },
  { day: "Sun", real: 17, fake: 9 },
];

function AdminPage() {
  const { history } = useAppState();
  const real = history.filter((h) => h.verdict === "REAL").length;
  const fake = history.length - real;
  const realPct = Math.round((real / Math.max(history.length, 1)) * 100);
  const maxDay = Math.max(...weekly.map((w) => w.real + w.fake));

  return (
    <PageShell>
      <section className="grid gap-5 pt-10 md:grid-cols-12">
        <div className="animate-rise md:col-span-7">
          <div className="glass-panel h-full rounded-2xl p-5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-lg font-semibold tracking-tight">
                Weekly check volume
              </h1>
              <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Last 7 days
              </span>
            </div>
            <div className="mt-6 flex h-52 items-end gap-3">
              {weekly.map((w) => (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 flex-col justify-end gap-1">
                    <div
                      className="w-full rounded-t bg-bad/70"
                      style={{ height: `${(w.fake / maxDay) * 100}%` }}
                      title={`${w.fake} fake`}
                    />
                    <div
                      className="w-full rounded-b bg-good/80"
                      style={{ height: `${(w.real / maxDay) * 100}%` }}
                      title={`${w.real} real`}
                    />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    {w.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-5 border-t border-line/70 pt-4 font-mono text-[10px] tracking-widest text-muted uppercase">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-good" /> Real
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-bad" /> Fake
              </span>
            </div>
          </div>
        </div>

        <div className="animate-rise md:col-span-5 [animation-delay:120ms]">
          <div className="glass-panel flex h-full flex-col rounded-2xl p-5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Admin · Real vs Fake
              </h2>
              <span className="font-mono text-[11px] tracking-widest text-muted uppercase">03</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Tile label="Real" value={real} tone="text-good" />
              <Tile label="Fake" value={fake} tone="text-bad" />
            </div>
            <div className="mt-4 space-y-3">
              <Bar label="Real" pct={realPct} tone="bg-good" />
              <Bar label="Fake" pct={100 - realPct} tone="bg-bad" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-line/70 pt-4">
              <Tile label="Total checks" value={history.length} tone="text-ink" />
              <Tile label="Model accuracy" value="92.4%" tone="text-verify" />
            </div>
          </div>
        </div>

        <div className="animate-rise md:col-span-12 [animation-delay:200ms]">
          <div className="glass-panel rounded-2xl p-5 ring-1 ring-line">
            <h2 className="font-display text-lg font-semibold tracking-tight">Recent activity</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    <th className="pb-2 font-normal">Headline</th>
                    <th className="pb-2 font-normal">Verdict</th>
                    <th className="pb-2 font-normal">Conf.</th>
                    <th className="pb-2 text-right font-normal">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {history.slice(0, 5).map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-ink/5">
                      <td className="max-w-[320px] truncate py-3 pr-4 text-ink">{row.headline}</td>
                      <td>
                        <VerdictBadge verdict={row.verdict} />
                      </td>
                      <td className="font-mono text-[13px] text-ink">{row.confidence}%</td>
                      <td className="py-3 text-right font-mono text-[12px] text-muted">
                        {row.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Tile({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="glass-inner rounded-xl p-3 ring-1 ring-line">
      <div className="font-mono text-[10px] tracking-widest text-muted uppercase">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold tracking-tight ${tone}`}>{value}</div>
    </div>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted uppercase">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
