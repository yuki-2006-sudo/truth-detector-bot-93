import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-[420px] rounded-full bg-verify/20 blur-3xl" />
        <div className="absolute top-1/4 -right-32 size-[480px] rounded-full bg-good/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[420px] rounded-full bg-ink/10 blur-3xl" />
      </div>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24">{children}</main>
    </div>
  );
}
