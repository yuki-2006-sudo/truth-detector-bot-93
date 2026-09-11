import { Link } from "@tanstack/react-router";
import { useAppState, signOut } from "@/lib/store";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/check", label: "Check news" },
  { to: "/history", label: "History" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteHeader() {
  const { user } = useAppState();

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-ink text-verify-ink">
            <span className="font-mono text-sm font-medium">V</span>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">Veridia</span>
          <span className="hidden font-mono text-[11px] tracking-widest text-muted uppercase sm:inline">
            NLP · TF-IDF
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="transition-colors hover:text-ink"
              activeProps={{ className: "text-ink font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <span className="hidden font-mono text-[11px] tracking-widest text-muted uppercase sm:inline">
                {user}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg px-3 py-2 text-sm text-muted ring-1 ring-line transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="rounded-lg px-3 py-2 text-sm text-muted ring-1 ring-line transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-verify-ink transition-colors hover:bg-ink/85"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
