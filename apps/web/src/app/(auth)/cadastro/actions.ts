"use server";

import { AuthError } from "next-auth";
import { getApiUrl } from "../../../lib/api-url";
import { signIn } from "../../../auth";

export type RegisterActionState = {
  message: string | null;
};

export async function registerWithCredentials(
  _state: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = readFormValue(formData, "name");
  const email = readFormValue(formData, "email").toLowerCase();
  const password = readFormValue(formData, "password");

  if (!email || !password) {
    return { message: "Informe email e senha para criar sua conta." };
  }

  if (password.length < 8) {
    return { message: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const response = await fetch(`${getApiUrl()}/auth/register`, {
    body: JSON.stringify({ email, name, password }),
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    return { message: await readApiError(response) };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { message: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Conta criada, mas não foi possível entrar automaticamente." };
    }

    throw error;
  }
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function readApiError(response: Response) {
  try {
    const body: unknown = await response.json();

    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      return body.message;
    }
  } catch {
    return "Não foi possível criar sua conta agora.";
  }

  return "Não foi possível criar sua conta agora.";
}
