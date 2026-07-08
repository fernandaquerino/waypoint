import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { signOut } from "@/auth";
import { fetchAuthenticatedApi } from "@/lib/authenticated-api";
import { getSession } from "@/lib/session";

type PrivateApiState = {
  message: string;
  userId: string | null;
};

export default async function DashboardPage() {
  const session = await getSession();
  const privateApi = await getPrivateApiState();

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <Link
            className="rounded-control text-lg font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            href="/dashboard"
          >
            Waypoint
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-control border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-sm font-semibold text-primary">Sessão ativa</p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">
              Olá{session?.user?.name ? `, ${session.user.name}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Este espaço já nasce autenticado para que as próximas features
              usem o `userId` vindo da sessão, não do client.
            </p>
          </div>

          <aside className="rounded-card border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-primary">API protegida</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="border-t border-border pt-4">
                <dt className="text-muted">Status</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {privateApi.message}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-muted">User ID validado</dt>
                <dd className="mt-1 break-all font-medium text-foreground">
                  {privateApi.userId ?? "Indisponível"}
                </dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}

async function getPrivateApiState(): Promise<PrivateApiState> {
  try {
    const response = await fetchAuthenticatedApi("/auth/me", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        message: `Erro ${response.status} ao chamar /auth/me`,
        userId: null,
      };
    }

    const body: unknown = await response.json();

    if (
      typeof body === "object" &&
      body !== null &&
      "data" in body &&
      typeof body.data === "object" &&
      body.data !== null &&
      "userId" in body.data &&
      typeof body.data.userId === "string"
    ) {
      return {
        message: "Token aceito pelo NestJS",
        userId: body.data.userId,
      };
    }
  } catch {
    return {
      message: "API protegida indisponível agora",
      userId: null,
    };
  }

  return {
    message: "Resposta inesperada da API",
    userId: null,
  };
}
