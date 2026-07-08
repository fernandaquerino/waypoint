import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais (`clsx`) e resolve conflitos de utilitários do
 * Tailwind (`tailwind-merge`). Ex.: cn("px-2", condicao && "px-4") → "px-4".
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
