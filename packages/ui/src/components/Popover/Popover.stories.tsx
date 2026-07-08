import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Abrir popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm text-foreground">
          Registre agora, organize depois.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const Filters: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Filtrar por tipo</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="grid gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Tipos de registro
          </p>
          <Checkbox label="Aprendizados" defaultChecked />
          <Checkbox label="Conquistas" />
          <Checkbox label="Dúvidas" />
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const QuickForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Renomear projeto</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="grid gap-3">
          <Input label="Nome do projeto" defaultValue="Waypoint" />
          <Button className="w-full">Salvar</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
