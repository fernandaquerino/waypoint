const DEFAULT_API_PORT = 3333;
const DEFAULT_WEB_URL = "http://localhost:3000";

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig: Record<string, unknown> = {
    ...config,
    API_PORT: parsePort(config.API_PORT ?? config.PORT, "API_PORT"),
    WEB_URL: parseString(config.WEB_URL, "WEB_URL", DEFAULT_WEB_URL),
  };

  if (config.DATABASE_URL !== undefined) {
    validatedConfig.DATABASE_URL = parseString(config.DATABASE_URL, "DATABASE_URL");
  }

  return validatedConfig;
}

function parsePort(value: unknown, name: string) {
  const port = Number(value ?? DEFAULT_API_PORT);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${name} must be a valid TCP port`);
  }

  return port;
}

function parseString(value: unknown, name: string, fallback?: string) {
  const parsedValue = String(value ?? fallback ?? "").trim();

  if (parsedValue.length === 0) {
    throw new Error(`${name} must not be empty`);
  }

  return parsedValue;
}
