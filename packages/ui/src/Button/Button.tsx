import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-control " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:opacity-50 " +
  "disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-surface-muted text-foreground hover:bg-border",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

/**
 * Botão base do design system. Sem regra de domínio — apenas variações visuais.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const classes = [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
