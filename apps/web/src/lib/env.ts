import { z } from "zod";

/**
 * Validação das variáveis de ambiente do web.
 *
 * O `.env` fica na raiz do monorepo e é carregado pelo `next.config.mjs`. Este
 * módulo valida na primeira importação (ex.: pelo `auth.ts`) e falha rápido com
 * uma mensagem clara caso algo esteja faltando — em vez de estourar um erro
 * obscuro só quando a variável for usada.
 *
 * Não logamos os valores, apenas quais chaves estão inválidas.
 */
const envSchema = z.object({
  // Obrigatórias — sem elas o app não sobe.
  DATABASE_URL: z.string().min(1, "obrigatória"),
  AUTH_SECRET: z.string().min(1, "obrigatória"),

  // Opcionais com comportamento/default definido no consumidor.
  AUTH_URL: z.url().optional(),
  API_URL: z.url().optional(),
  NEXT_PUBLIC_API_URL: z.url().optional(),

  // Provider Google — opcional para permitir rodar local só com email/senha.
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Variáveis de ambiente inválidas no web:\n${issues}\n` +
        "Confira o .env na raiz do monorepo (veja .env.example).",
    );
  }

  return parsed.data;
}

export const env = loadEnv();

export type Env = typeof env;
