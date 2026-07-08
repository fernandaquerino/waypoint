"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { cn } from "../../utils/cn";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground",
        primary: "border-transparent bg-primary-muted text-primary",
        success: "border-transparent bg-success-soft text-success",
        info: "border-transparent bg-info-soft text-info",
        danger: "border-transparent bg-danger-soft text-danger",
        teal: "border-transparent bg-teal-soft text-teal",
        purple: "border-transparent bg-purple-soft text-purple",
      },
      interactive: {
        true: "cursor-pointer hover:border-border-strong hover:bg-surface-hover",
        false: "",
      },
      selected: {
        true: "border-primary bg-primary-muted text-primary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      selected: false,
    },
  },
);

interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "onClick">,
    Pick<VariantProps<typeof chipVariants>, "variant"> {
  /** Estado de filtro selecionado. Só tem efeito quando o chip é clicável. */
  selected?: boolean;
  /** Torna o chip um botão de filtro clicável. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Exibe o botão de remoção (×) ao final do chip. */
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  /** Rótulo acessível do botão de remoção. */
  removeLabel?: string;
}

function Chip({
  className,
  variant,
  selected = false,
  onClick,
  onRemove,
  removeLabel = "Remover",
  children,
  ...props
}: ChipProps) {
  const isInteractive = Boolean(onClick) && !onRemove;

  const chipClassName = cn(
    chipVariants({ variant, interactive: isInteractive, selected }),
    className,
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        data-slot="chip"
        aria-pressed={selected}
        onClick={onClick}
        className={chipClassName}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <span data-slot="chip" className={chipClassName} {...props}>
      {children}
      {onRemove ? (
        <button
          type="button"
          data-slot="chip-remove"
          aria-label={removeLabel}
          onClick={onRemove}
          className="-mr-1 ml-0.5 inline-flex size-4 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <XIcon className="size-3" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

export { Chip, chipVariants };
export type { ChipProps };
