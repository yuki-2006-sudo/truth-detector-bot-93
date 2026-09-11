import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { signIn } from "@/lib/store";

type Mode = "login" | "register";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "register" ? "register" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or register — Veridia" },
      {
        name: "description",
        content: "Create a Veridia account or log in to save your fake news analysis history.",
      },
      { property: "og:title", content: "Sign in or register — Veridia" },
      {
        property: "og:description",
        content: "Create a Veridia account or log in to save your analysis history.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("student@college.edu");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");

  const isRegister = mode === "register";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    signIn(email);
    navigate({ to: "/check" });
  }

  return (
    <PageShell>
      <section className="animate-rise mx-auto grid max-w-4xl gap-5 pt-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-verify uppercase">
            <span className="inline-block size-1.5 rounded-full bg-verify" /> Account
          </div>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight">
            {isRegister ? "Create an account." : "Welcome back."}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Accounts keep every check in your analysis history so you can replay results during the
            viva. Demo credentials are pre-filled.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="glass-panel rounded-2xl p-6 ring-1 ring-line">
            <div className="flex gap-2">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => navigate({ to: "/auth", search: { mode: m } })}
                  className={`rounded-lg px-4 py-2 font-mono text-[11px] tracking-widest uppercase transition-colors ${
                    mode === m ? "bg-ink text-verify-ink" : "text-muted ring-1 ring-line"
                  }`}
                >
                  {m === "login" ? "Log in" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              {isRegister && (
                <Field label="Full name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="glass-inner w-full rounded-xl p-3 text-sm text-ink ring-1 ring-line placeholder:text-muted/60 focus:ring-2 focus:ring-verify focus:outline-none"
                  />
                </Field>
              )}
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-inner w-full rounded-xl p-3 text-sm text-ink ring-1 ring-line focus:ring-2 focus:ring-verify focus:outline-none"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-inner w-full rounded-xl p-3 text-sm text-ink ring-1 ring-line focus:ring-2 focus:ring-verify focus:outline-none"
                />
              </Field>
              <button
                type="submit"
                className="w-full rounded-xl bg-ink px-5 py-3 text-sm font-medium text-verify-ink transition-transform duration-200 hover:-translate-y-0.5"
              >
                {isRegister ? "Create account" : "Log in"}
              </button>
            </form>
            <p className="mt-3 font-mono text-[11px] tracking-widest text-muted uppercase">
              Demo only · no data leaves this page
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-widest text-muted uppercase">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
