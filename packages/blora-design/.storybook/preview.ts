import type { Preview } from "@storybook/web-components";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FAF7F8" },
        { name: "dark", value: "#1A1A1F" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          // WCAG 2.2 AA baseline
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
};

export default preview;
