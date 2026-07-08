import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// O .env fica na raiz do monorepo; o Next só carrega envs do diretório do app
// por padrão. Carregamos o .env da raiz para compartilhar as mesmas variáveis
// entre web e api. Em produção as variáveis vêm do ambiente real, então o
// arquivo pode não existir.
const monorepoEnv = path.join(__dirname, "../..", ".env");
if (fs.existsSync(monorepoEnv)) {
  process.loadEnvFile(monorepoEnv);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@waypoint/db", "@waypoint/types", "@waypoint/ui"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
