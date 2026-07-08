import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders an accessible switch with default styles", () => {
    render(<Switch aria-label="Ativar alertas" />);

    const switchControl = screen.getByRole("switch", {
      name: "Ativar alertas",
    });

    expect(switchControl).toBeInTheDocument();
    expect(switchControl).toHaveAttribute("data-slot", "switch");
    expect(switchControl).toHaveAttribute("aria-checked", "false");
    expect(switchControl).toHaveClass("h-6");
    expect(switchControl).toHaveClass("w-11");
    expect(switchControl).toHaveClass("focus-visible:ring-2");
    expect(
      switchControl.querySelector("[data-slot='switch-thumb']"),
    ).toBeInTheDocument();
  });

  it("renders checked state", () => {
    render(<Switch aria-label="Ativar alertas" defaultChecked />);

    const switchControl = screen.getByRole("switch", {
      name: "Ativar alertas",
    });

    expect(switchControl).toHaveAttribute("aria-checked", "true");
    expect(switchControl).toHaveAttribute("data-state", "checked");
    expect(switchControl).toHaveClass("data-[state=checked]:bg-primary");
  });

  it("calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch aria-label="Ativar alertas" onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByRole("switch", { name: "Ativar alertas" }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles with keyboard interaction", async () => {
    const user = userEvent.setup();

    render(<Switch aria-label="Ativar alertas" />);

    const switchControl = screen.getByRole("switch", {
      name: "Ativar alertas",
    });

    await user.tab();
    expect(switchControl).toHaveFocus();

    await user.keyboard("[Space]");
    expect(switchControl).toHaveAttribute("aria-checked", "true");
  });

  it("supports disabled state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        aria-label="Ativar alertas"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const switchControl = screen.getByRole("switch", {
      name: "Ativar alertas",
    });

    expect(switchControl).toBeDisabled();

    await user.click(switchControl);

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("associates a visible label with the switch", async () => {
    const user = userEvent.setup();

    render(<Switch label="Receber resumo" />);

    const switchControl = screen.getByRole("switch", {
      name: "Receber resumo",
    });

    // Clicar no label alterna o switch (associação via htmlFor/id).
    await user.click(screen.getByText("Receber resumo"));

    expect(switchControl).toHaveAttribute("aria-checked", "true");
  });

  it("renders helper text linked via aria-describedby", () => {
    render(<Switch label="Notificações" helperText="Um e-mail por dia" />);

    const switchControl = screen.getByRole("switch", { name: "Notificações" });
    const helper = screen.getByText("Um e-mail por dia");

    expect(switchControl).toHaveAttribute(
      "aria-describedby",
      helper.getAttribute("id"),
    );
  });

  it("renders an error with role alert and marks the switch invalid", () => {
    render(<Switch label="Termos" error="Ative para continuar" />);

    const switchControl = screen.getByRole("switch", { name: "Termos" });
    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Ative para continuar");
    expect(switchControl).toHaveAttribute("aria-invalid", "true");
    expect(switchControl).toHaveAttribute(
      "aria-describedby",
      error.getAttribute("id"),
    );
  });

  it("does not render helper text when an error is present", () => {
    render(<Switch label="Termos" helperText="Ajuda" error="Erro" />);

    expect(screen.queryByText("Ajuda")).not.toBeInTheDocument();
    expect(screen.getByText("Erro")).toBeInTheDocument();
  });

  it("supports custom className", () => {
    render(<Switch aria-label="Ativar alertas" className="custom-switch" />);

    expect(screen.getByRole("switch", { name: "Ativar alertas" })).toHaveClass(
      "custom-switch",
    );
  });
});
