import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Ativar notificações" },
};

export const Checked: Story = {
  args: { "aria-label": "Notificações ativas", defaultChecked: true },
};

export const Disabled: Story = {
  args: { "aria-label": "Opção indisponível", disabled: true },
};

export const DisabledChecked: Story = {
  args: {
    "aria-label": "Configuração ativa",
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  args: { label: "Receber resumo semanal", defaultChecked: true },
};

export const WithHelperText: Story = {
  args: {
    label: "Notificações por e-mail",
    helperText: "Enviamos no máximo um e-mail por dia.",
  },
};

export const WithError: Story = {
  args: {
    label: "Aceitar os termos",
    error: "Você precisa ativar para continuar.",
  },
};

export const SettingsList: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="w-80 divide-y divide-border rounded-lg border border-border">
      {[
        { label: "Momento profissional ativo", on: true },
        { label: "Lembrete de review semanal", on: true },
        { label: "Foco da semana no dashboard", on: false },
        { label: "Termômetro de energia", on: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between p-4">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          <Switch aria-label={item.label} defaultChecked={item.on} />
        </div>
      ))}
    </div>
  ),
};
