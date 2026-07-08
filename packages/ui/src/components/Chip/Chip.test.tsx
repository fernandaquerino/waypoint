import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders a static span by default", () => {
    render(<Chip>React</Chip>);

    const chip = screen.getByText("React");

    expect(chip).toBeInTheDocument();
    expect(chip.tagName).toBe("SPAN");
    expect(chip).toHaveAttribute("data-slot", "chip");
    expect(chip).toHaveClass("inline-flex");
    expect(chip).toHaveClass("rounded-2xl");
  });

  it.each([
    ["primary", "bg-primary-muted"],
    ["success", "bg-success-soft"],
    ["info", "bg-info-soft"],
    ["danger", "bg-danger-soft"],
    ["teal", "bg-teal-soft"],
    ["purple", "bg-purple-soft"],
  ] as const)("renders %s variant classes", (variant, expectedClass) => {
    render(<Chip variant={variant}>Tag</Chip>);

    expect(screen.getByText("Tag")).toHaveClass(expectedClass);
  });

  it("renders a button with aria-pressed when clickable", () => {
    render(
      <Chip onClick={() => {}} selected>
        Aberta
      </Chip>,
    );

    const chip = screen.getByRole("button", { name: "Aberta" });

    expect(chip.tagName).toBe("BUTTON");
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveClass("cursor-pointer");
    expect(chip).toHaveClass("border-primary");
  });

  it("fires onClick when the filter chip is activated", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Chip onClick={onClick}>Dúvida</Chip>);

    await user.click(screen.getByRole("button", { name: "Dúvida" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render a remove button by default", () => {
    render(<Chip>React</Chip>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an accessible remove button and fires onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <Chip onRemove={onRemove} removeLabel="Remover react">
        react
      </Chip>,
    );

    // O corpo do chip continua sendo um span (não vira botão).
    expect(screen.getByText("react").tagName).toBe("SPAN");

    const removeButton = screen.getByRole("button", { name: "Remover react" });
    expect(removeButton).toHaveAttribute("data-slot", "chip-remove");

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("prioritizes the removable mode when both handlers are passed", () => {
    render(
      <Chip onClick={() => {}} onRemove={() => {}}>
        react
      </Chip>,
    );

    // Corpo não é clicável (evita botões aninhados); só existe o botão de remoção.
    expect(screen.getByText("react").tagName).toBe("SPAN");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-slot",
      "chip-remove",
    );
  });

  it("supports custom className", () => {
    render(<Chip className="custom-chip">Tag</Chip>);

    expect(screen.getByText("Tag")).toHaveClass("custom-chip");
  });
});
