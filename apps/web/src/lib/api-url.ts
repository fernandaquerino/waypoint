import { env } from "./env";

const DEFAULT_API_URL = "http://localhost:3333";

export function getApiUrl() {
  return env.API_URL ?? env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}
