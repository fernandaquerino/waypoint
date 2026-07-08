import type { Session } from "next-auth";
import { auth } from "@/auth";

/**
 * Lê a sessão atual de forma resiliente.
 *
 * Um cookie de sessão inválido — por exemplo assinado com um `AUTH_SECRET`
 * antigo — faz o Auth.js lançar `JWTSessionError`. Em vez de deixar isso virar
 * um 500 na tela, tratamos como "sem sessão" e retornamos `null`. O cookie
 * inválido é ignorado e sobrescrito no próximo login bem-sucedido.
 */
export async function getSession(): Promise<Session | null> {
  try {
    return await auth();
  } catch (error) {
    console.warn("[auth] Falha ao ler a sessão, tratando como deslogada.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return null;
  }
}
