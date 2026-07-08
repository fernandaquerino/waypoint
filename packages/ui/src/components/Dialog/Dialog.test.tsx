import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

describe("Dialog", () => {
  it("renders trigger and open dialog content", () => {
    render(
      <Dialog open>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova conquista</DialogTitle>
            <DialogDescription>Preencha os dados.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Abrir")).toHaveAttribute(
      "data-slot",
      "dialog-trigger",
    );
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-slot",
      "dialog-content",
    );
    expect(screen.getByText("Nova conquista")).toHaveAttribute(
      "data-slot",
      "dialog-title",
    );
    expect(screen.getByText("Preencha os dados.")).toHaveAttribute(
      "data-slot",
      "dialog-description",
    );
    expect(document.querySelector("[data-slot='dialog-overlay']")).toBeTruthy();
  });

  it("links title and description to the dialog for assistive tech", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Nova conquista</DialogTitle>
          <DialogDescription>Registre uma evidência.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Nova conquista" });

    expect(dialog).toHaveAccessibleDescription("Registre uma evidência.");
  });

  it("uses default content styles and supports custom className", () => {
    render(
      <Dialog open>
        <DialogContent className="custom-dialog">
          <DialogTitle>Nova conquista</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveClass("max-w-lg");
    expect(dialog).toHaveClass("rounded-xl");
    expect(dialog).toHaveClass("bg-surface");
    expect(dialog).toHaveClass("custom-dialog");
  });

  it("renders header and footer composition slots", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>Cabeçalho</DialogHeader>
          <DialogTitle>Nova conquista</DialogTitle>
          <DialogFooter>Rodapé</DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Cabeçalho")).toHaveAttribute(
      "data-slot",
      "dialog-header",
    );
    expect(screen.getByText("Rodapé")).toHaveAttribute(
      "data-slot",
      "dialog-footer",
    );
  });

  it("renders default close button and calls onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Nova conquista</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Nova conquista</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("can hide default close button and use a custom close", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Nova conquista</DialogTitle>
          <DialogClose>Cancelar</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    expect(
      screen.queryByRole("button", { name: "Fechar" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
