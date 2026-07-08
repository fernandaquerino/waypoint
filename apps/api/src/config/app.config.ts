const DEFAULT_API_PORT = 3333;
const DEFAULT_WEB_URL = "http://localhost:3000";

export const appConfig = () => ({
  app: {
    corsOrigin: process.env.WEB_URL ?? DEFAULT_WEB_URL,
    port: Number(process.env.API_PORT ?? process.env.PORT ?? DEFAULT_API_PORT),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
