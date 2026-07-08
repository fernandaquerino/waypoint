import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

describe("Drawer", () => {
  it("renders trigger and open drawer content", () => {
    render(
      <Drawer open>
        <DrawerTrigger>Abrir</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Ajuste a busca.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText("Abrir")).toHaveAttribute(
      "data-slot",
      "drawer-trigger",
    );
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-slot",
      "drawer-content",
    );
    expect(screen.getByText("Filtros")).toHaveAttribute(
      "data-slot",
      "drawer-title",
    );
    expect(screen.getByText("Ajuste a busca.")).toHaveAttribute(
      "data-slot",
      "drawer-description",
    );
    expect(document.querySelector("[data-slot='drawer-overlay']")).toBeTruthy();
  });

  it("defaults to the right side and supports custom className", () => {
    render(
      <Drawer open>
        <DrawerContent className="custom-drawer">
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveClass("fixed");
    expect(drawer).toHaveClass("right-0");
    expect(drawer).toHaveClass("h-full");
    expect(drawer).toHaveClass("bg-surface");
    expect(drawer).toHaveClass("custom-drawer");
  });

  it("positions from the bottom when side is bottom", () => {
    render(
      <Drawer open>
        <DrawerContent side="bottom">
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveClass("bottom-0");
    expect(drawer).toHaveClass("rounded-t-xl");
  });

  it("renders header and footer composition slots", () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>Cabeçalho</DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerFooter>Rodapé</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText("Cabeçalho")).toHaveAttribute(
      "data-slot",
      "drawer-header",
    );
    expect(screen.getByText("Rodapé")).toHaveAttribute(
      "data-slot",
      "drawer-footer",
    );
  });

  it("renders default close button and calls onOpenChange", () => {
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("can hide default close button and use a custom close", () => {
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent showCloseButton={false}>
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerClose>Cancelar</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    expect(
      screen.queryByRole("button", { name: "Fechar" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
