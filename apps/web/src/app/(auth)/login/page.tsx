import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getSession } from "@/lib/session";
import { loginWithGoogle } from "./actions";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <Link
            className="rounded-control text-lg font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            href="/"
          >
            Waypoint
          </Link>
          <ThemeToggle />
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          <p className="text-sm font-semibold text-primary">
            Entrar no Waypoint
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            Continue sua memória profissional.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Use Google ou email e senha para acessar seus registros com sessão
            segura.
          </p>

          <div className="mt-8 rounded-card border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
            <form action={loginWithGoogle}>
              <button
                className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                type="submit"
              >
                Entrar com Google
              </button>
            </form>

            <div className="my-5 h-px bg-border" />

            <LoginForm />
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            Ainda não tem conta?{" "}
            <Link
              className="font-semibold text-primary outline-none focus-visible:rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              href="/cadastro"
            >
              Criar conta
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
