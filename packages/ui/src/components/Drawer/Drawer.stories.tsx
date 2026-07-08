import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";
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

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filters: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Filtros</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar registros</DrawerTitle>
          <DrawerDescription>
            Refine por tipo e status para encontrar mais rápido.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-3">
          <Checkbox label="Aprendizados" defaultChecked />
          <Checkbox label="Conquistas" />
          <Checkbox label="Dúvidas" />
          <Checkbox label="Tarefas" />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost">Limpar</Button>
          </DrawerClose>
          <Button>Aplicar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Abrir à esquerda</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navegação</DrawerTitle>
          <DrawerDescription>Acesse as áreas do Waypoint.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomSheet: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Registrar rápido</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Registro rápido</DrawerTitle>
          <DrawerDescription>
            Registre agora, organize depois.
          </DrawerDescription>
        </DrawerHeader>
        <Input label="O que você aprendeu hoje?" placeholder="Anote aqui" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DrawerClose>
          <Button>Salvar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
