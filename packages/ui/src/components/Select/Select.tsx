"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleAlertIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  label?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione",
  label,
  helperText,
  error,
  disabled,
  required,
  name,
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const hasError = Boolean(error);
  const accessibleName =
    label ?? props["aria-label"] ?? props["aria-labelledby"];
  const descriptionId = hasError
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;

  if (process.env.NODE_ENV !== "production" && !accessibleName) {
    console.warn("Select must include label, aria-label, or aria-labelledby.");
  }

  return (
    <div className="grid w-full gap-2">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-foreground"
        >
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          data-slot="select-trigger"
          aria-invalid={hasError || undefined}
          aria-describedby={descriptionId}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          className={cn(
            "flex h-[38px] w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-[13.5px] text-foreground transition-[border-color,box-shadow] duration-[140ms] outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.12)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_3px_hsl(var(--destructive)_/_0.12)] data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1 [&>span]:text-left",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            data-slot="select-content"
            position="item-aligned"
            sideOffset={6}
            className="shadow-pop relative z-50 max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface text-foreground"
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-muted-foreground">
              <ChevronUpIcon className="size-4" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  data-slot="select-item"
                  className="relative flex cursor-pointer items-center rounded-md py-2 pr-8 pl-3 text-[13.5px] text-foreground outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-hover data-[state=checked]:font-medium"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                    <CheckIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-muted-foreground">
              <ChevronDownIcon className="size-4" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {helperText && !error ? (
        <p id={`${selectId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-danger"
        >
          <CircleAlertIcon className="size-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Select };
export type { SelectOption, SelectProps };
