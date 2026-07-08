import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "./preview.css";

const preview: Preview = {
  // Alterna o tema aplicando `data-theme` na raiz, igual ao app web.
  globalTypes: {
    theme: {
      description: "Tema do design system",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? "light";
      useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
      }, [theme]);
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
