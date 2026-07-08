import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { getApiUrl } from "./api-url";
import { env } from "./env";

export async function fetchAuthenticatedApi(path: string, init: RequestInit = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authenticated API calls require an active session");
  }

  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("Authorization", `Bearer ${token}`);

  return fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: requestHeaders,
  });
}

async function getAuthToken() {
  return getToken({
    req: { headers: await headers() },
    raw: true,
    secret: env.AUTH_SECRET,
    secureCookie: env.AUTH_URL?.startsWith("https://") ?? false,
  });
}
