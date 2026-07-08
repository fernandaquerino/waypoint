import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "success",
        "info",
        "danger",
        "teal",
        "purple",
      ],
    },
    selected: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "React" } };

export const Primary: Story = {
  args: { children: "TypeScript", variant: "primary" },
};

export const Removivel: Story = {
  args: { children: "onboarding", onRemove: () => {} },
};

export const Filtro: Story = {
  args: { children: "Aberta", onClick: () => {}, selected: true },
};

export const Tags: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="primary">TypeScript</Chip>
      <Chip variant="success">Concluído</Chip>
      <Chip variant="info">Documentação</Chip>
      <Chip variant="teal">Backend</Chip>
      <Chip variant="purple">Design</Chip>
      <Chip variant="danger">Bloqueado</Chip>
      <Chip>Sem cor</Chip>
    </div>
  ),
};

export const FiltrosSelecionaveis: Story = {
  parameters: { layout: "padded" },
  render: function FiltrosRender() {
    const opcoes = ["Aprendizado", "Dúvida", "Conquista", "Tarefa"];
    const [selecionados, setSelecionados] = React.useState<string[]>([
      "Conquista",
    ]);

    const alternar = (opcao: string) =>
      setSelecionados((atual) =>
        atual.includes(opcao)
          ? atual.filter((item) => item !== opcao)
          : [...atual, opcao],
      );

    return (
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => (
          <Chip
            key={opcao}
            selected={selecionados.includes(opcao)}
            onClick={() => alternar(opcao)}
          >
            {opcao}
          </Chip>
        ))}
      </div>
    );
  },
};

export const TagsRemoviveis: Story = {
  parameters: { layout: "padded" },
  render: function TagsRender() {
    const [tags, setTags] = React.useState([
      "react",
      "next",
      "drizzle",
      "auth",
    ]);

    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            variant="primary"
            onRemove={() => setTags((atual) => atual.filter((t) => t !== tag))}
            removeLabel={`Remover ${tag}`}
          >
            {tag}
          </Chip>
        ))}
      </div>
    );
  },
};
