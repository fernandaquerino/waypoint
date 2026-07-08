import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./Select";

const companySizeOptions = [
  { label: "Just me", value: "just-me" },
  { label: "1-5", value: "1-5" },
  { label: "5-25", value: "5-25" },
  { label: "25-100", value: "25-100" },
  { label: "100-250", value: "100-250" },
  { label: "250-1000", value: "250-1000" },
  { label: "1000+", value: "1000+" },
  { label: "Prefiro não informar", value: "prefer-not" },
];

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    label: "Qual o tamanho da sua empresa?",
    placeholder: "Selecione o tamanho",
    options: companySizeOptions,
  },
  decorators: [
    (Story) => (
      <div className="w-[316px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "25-100" },
};

export const WithHelper: Story = {
  args: { helperText: "Isso nos ajuda a personalizar sua experiência." },
};

export const WithError: Story = {
  args: { error: "Selecione uma opção para continuar." },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "5-25" },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: "Just me", value: "just-me" },
      { label: "1-5", value: "1-5" },
      { label: "5-25 (em breve)", value: "5-25", disabled: true },
      { label: "25-100", value: "25-100" },
    ],
  },
};

export const Controlled: Story = {
  render: function ControlledRender(args) {
    const [value, setValue] = React.useState<string>();

    return (
      <div className="grid gap-3">
        <Select {...args} value={value} onValueChange={setValue} />
        <p className="text-xs text-muted-foreground">
          Valor selecionado: {value ?? "nenhum"}
        </p>
      </div>
    );
  },
};
