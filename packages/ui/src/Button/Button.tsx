import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-danger hover:bg-danger-light",
        secondary: "bg-surface hover:bg-surface-hover",
        ghost: "bg-transparent hover:bg-surface",
        outline: "bg-transparent border border-border hover:bg-surface",
        link: "bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

interface BaseButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    Omit<ButtonVariantProps, "size"> {
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

type ButtonA11yProps =
  | {
      size: "icon";
      "aria-label": string;
      "aria-labelledby": string;
    }
  | {
      size?: Exclude<ButtonSize, "icon">;
      "aria-label"?: string;
      "aria-labelledby"?: string;
    };

type ButtonProps = BaseButtonProps & ButtonA11yProps;

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  const accessibleName = props["aria-label"] ?? props["aria-labelledby"];

  if (!accessibleName) {
    console.warn(
      'Button with size="icon" must include aria-label or aria-labelledby.',
    );
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <Comp
      data-slot="button"
      data-loading={loading ? "" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={!asChild ? isDisabled : undefined}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      <Slottable>{children}</Slottable>
      {loading && <Spinner />}
    </Comp>
  );
}

export { Button };
