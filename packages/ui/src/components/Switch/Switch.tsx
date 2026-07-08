"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { CircleAlertIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface SwitchProps extends Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  "children"
> {
  label?: string;
  helperText?: string;
  error?: string;
}

function Switch({
  className,
  id,
  label,
  helperText,
  error,
  disabled,
  ...props
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  const hasError = Boolean(error);
  const descriptionId = hasError
    ? `${switchId}-error`
    : helperText
      ? `${switchId}-helper`
      : undefined;

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <SwitchPrimitive.Root
          data-slot="switch"
          id={switchId}
          disabled={disabled}
          aria-describedby={descriptionId}
          aria-invalid={hasError || undefined}
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border-strong transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-danger data-[state=checked]:bg-primary",
            className,
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className="pointer-events-none block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          />
        </SwitchPrimitive.Root>

        {label ? (
          <label
            htmlFor={switchId}
            className="cursor-pointer text-sm leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >
            {label}
          </label>
        ) : null}
      </div>

      {helperText && !error ? (
        <p
          id={`${switchId}-helper`}
          className="pl-[3.375rem] text-xs text-muted-foreground"
        >
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${switchId}-error`}
          role="alert"
          className="flex items-center gap-2 pl-[3.375rem] text-xs text-danger"
        >
          <CircleAlertIcon className="size-4" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Switch };
export type { SwitchProps };
