import type { Verdict } from "@/lib/detector";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "REAL" ? "bg-good/15 text-good" : "bg-bad/15 text-bad";
  return (
    <span
      className={`rounded-md px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase ${tone}`}
    >
      {verdict === "REAL" ? "Real" : "Fake"}
    </span>
  );
}
