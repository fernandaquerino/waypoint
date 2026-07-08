// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

/**
 * Configuração ESLint única para todo o monorepo (flat config).
 *
 * Manter uma só config na raiz tem duas vantagens práticas:
 * - o `lint-staged` roda a partir da raiz e enxerga todos os arquivos com as
 *   mesmas regras, sem depender de config por pacote;
 * - `eslint .` na raiz cobre apps e packages de uma vez.
 *
 * Usamos o preset `recommended` do typescript-eslint (sem type-checking) para
 * manter o lint rápido no pre-commit. Regras type-aware (mais lentas) podem ser
 * adicionadas depois numa sprint dedicada, se necessário. // Future
 */
export default tseslint.config(
  {
    // Ignorados globais — nada gerado ou externo deve ser lintado.
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/*.tsbuildinfo",
      "**/storybook-static/**", // build estático do Storybook
      "packages/db/drizzle/**", // migrations geradas pelo drizzle-kit
      "apps/web/next-env.d.ts", // gerado pelo Next
    ],
  },

  // Base para todos os arquivos TS/TSX.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      // Erros previsíveis não devem ser engolidos silenciosamente (AGENTS §7).
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Permitir args/vars intencionalmente ignorados com prefixo `_`.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Backend NestJS — ambiente Node, decorators.
  {
    files: ["apps/api/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Pacotes de biblioteca — ambiente Node por padrão.
  {
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Componentes do design system (packages/ui) — React em ambiente browser.
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Frontend Next.js — ambiente browser + regras de React/Next.
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // App Router puro: não existe diretório `pages/`, então essa regra só gera ruído.
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Arquivos de config na raiz e nos pacotes rodam em Node.
  {
    files: ["**/*.config.{js,mjs,ts}", "**/drizzle.config.ts"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Desliga regras de formatação que conflitam com o Prettier (deve vir por último).
  prettier,
);
