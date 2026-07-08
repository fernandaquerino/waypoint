import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Sem `globals: true`, o cleanup automático do Testing Library não é
// registrado — fazemos manualmente entre os testes.
afterEach(() => {
  cleanup();
});
