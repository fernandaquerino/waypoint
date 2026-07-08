import { ThemeToggle } from "../components/theme/theme-toggle";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <a
            href="/"
            className="rounded-control text-lg font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            Waypoint
          </a>
          <ThemeToggle />
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-16">
          <div>
            <p className="mb-4 text-sm font-semibold text-primary">
              Waypoint em construção
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Nada importante da sua carreira precisa ficar só na sua cabeça.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Uma base simples para registrar aprendizados, dúvidas, conquistas
              e próximos passos com calma desde o começo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${apiUrl}/health`}
                className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] outline-none transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                Ver health da API
              </a>
              <a
                href={apiUrl}
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-4 text-sm font-semibold text-foreground outline-none transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                Abrir API local
              </a>
            </div>
          </div>

          <aside
            className="rounded-card border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
            aria-label="Estado do ambiente local"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Base web</p>
                <h2 className="mt-2 text-2xl font-semibold">Pronta para evoluir</h2>
              </div>
              <span className="rounded-control bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                Sprint 0
              </span>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <dt className="text-muted">Web</dt>
                <dd className="font-medium">Next.js App Router</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <dt className="text-muted">Tema</dt>
                <dd className="font-medium">CSS variables</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <dt className="text-muted">UI</dt>
                <dd className="font-medium">@waypoint/ui</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}
