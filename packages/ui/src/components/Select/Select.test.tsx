import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

const options = [
  { label: "Just me", value: "just-me" },
  { label: "1-5", value: "1-5" },
  { label: "5-25", value: "5-25" },
];

beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn();
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Select", () => {
  it("renders a labelled trigger showing the placeholder", () => {
    render(
      <Select
        label="Tamanho da empresa"
        placeholder="Selecione"
        options={options}
      />,
    );

    const trigger = screen.getByRole("combobox", {
      name: "Tamanho da empresa",
    });

    expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    expect(trigger).toHaveTextContent("Selecione");
    expect(trigger).toHaveAttribute("data-placeholder");
  });

  it("uses aria-label when there is no visible label", () => {
    render(<Select aria-label="Tamanho" options={options} />);

    expect(
      screen.getByRole("combobox", { name: "Tamanho" }),
    ).toBeInTheDocument();
  });

  it("shows the selected option label instead of the placeholder", () => {
    render(
      <Select
        aria-label="Tamanho"
        placeholder="Selecione"
        defaultValue="1-5"
        options={options}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Tamanho" });

    expect(trigger).toHaveTextContent("1-5");
    expect(trigger).not.toHaveAttribute("data-placeholder");
  });

  it("opens the list and selects an option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="Tamanho"
        options={options}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Tamanho" }));

    expect(
      await screen.findByRole("option", { name: "Just me" }),
    ).toBeVisible();

    await user.click(screen.getByRole("option", { name: "5-25" }));

    expect(onValueChange).toHaveBeenCalledWith("5-25");
  });

  it("renders helper text with the right aria-describedby", () => {
    render(
      <Select
        aria-label="Tamanho"
        helperText="Escolha uma faixa"
        options={options}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Tamanho" });
    const helper = screen.getByText("Escolha uma faixa");

    expect(helper).toHaveAttribute("id");
    expect(trigger).toHaveAttribute(
      "aria-describedby",
      helper.getAttribute("id"),
    );
  });

  it("renders an error with role alert and marks the trigger invalid", () => {
    render(
      <Select
        aria-label="Tamanho"
        error="Campo obrigatório"
        options={options}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Tamanho" });
    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Campo obrigatório");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute(
      "aria-describedby",
      error.getAttribute("id"),
    );
  });

  it("does not render helper text when an error is present", () => {
    render(
      <Select
        aria-label="Tamanho"
        helperText="Ajuda"
        error="Erro"
        options={options}
      />,
    );

    expect(screen.queryByText("Ajuda")).not.toBeInTheDocument();
    expect(screen.getByText("Erro")).toBeInTheDocument();
  });

  it("disables the trigger when disabled", () => {
    render(<Select aria-label="Tamanho" disabled options={options} />);

    expect(screen.getByRole("combobox", { name: "Tamanho" })).toBeDisabled();
  });

  it("warns in dev when there is no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Select options={options} />);

    expect(warn).toHaveBeenCalledWith(
      "Select must include label, aria-label, or aria-labelledby.",
    );

    warn.mockRestore();
  });
});
