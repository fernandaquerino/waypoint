"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../../auth";

export type LoginActionState = {
  message: string | null;
};

export async function loginWithCredentials(
  _state: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = readFormValue(formData, "email").toLowerCase();
  const password = readFormValue(formData, "password");

  if (!email || !password) {
    return { message: "Informe email e senha para entrar." };
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
      return { message: "Email ou senha inválidos." };
    }

    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
