import { z } from "zod";

const DEFAULT_API_PORT = 3333;
const DEFAULT_WEB_URL = "http://localhost:3000";

const port = z.coerce
  .number()
  .int()
  .positive()
  .max(65535, "deve ser uma porta TCP válida");

const envSchema = z.object({
  API_PORT: port.default(DEFAULT_API_PORT),
  AUTH_SECRET: z.string().min(1, "não pode ser vazia"),
  WEB_URL: z.string().min(1).default(DEFAULT_WEB_URL),
  DATABASE_URL: z.string().min(1, "não pode ser vazia").optional(),
});

/**
 * Valida as variáveis de ambiente da API na inicialização do NestJS.
 *
 * Recebe o env cru do `ConfigModule` e devolve o config com os valores
 * validados/coeridos (ex.: `API_PORT` vira número). Preserva as demais chaves
 * (`POSTGRES_*`, etc.) e mantém o fallback `API_PORT ?? PORT`. Falha rápido com
 * mensagem clara, sem logar valores.
 */
export function validateEnvironment(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse({
    ...config,
    API_PORT: config.API_PORT ?? config.PORT,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Variáveis de ambiente inválidas na API:\n${issues}\n` +
        "Confira o .env na raiz do monorepo (veja .env.example).",
    );
  }

  return {
    ...config,
    ...parsed.data,
  };
}
