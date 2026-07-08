"use client";

import { useActionState } from "react";
import { registerWithCredentials, type RegisterActionState } from "./actions";

const initialState: RegisterActionState = {
  message: null,
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerWithCredentials,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-foreground">Nome</span>
        <input
          autoComplete="name"
          className="mt-2 min-h-11 w-full rounded-control border border-border bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          name="name"
          type="text"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input
          autoComplete="email"
          className="mt-2 min-h-11 w-full rounded-control border border-border bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          name="email"
          required
          type="email"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Senha</span>
        <input
          autoComplete="new-password"
          className="mt-2 min-h-11 w-full rounded-control border border-border bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </label>

      {state.message ? (
        <p className="rounded-card border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 px-3 py-2 text-sm font-medium text-[color:var(--danger)]">
          {state.message}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] outline-none transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
