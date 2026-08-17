import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { createBloraIcon } from "../src/core/icons";

const meta = {
  title: "Actions/Button",
  component: "button.blora-button",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<button>` with stable `.blora-button` class. Use `data-variant` and `data-size` for variants.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html` <button class="blora-button" type="button">保存</button> `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row">
      <button class="blora-button" type="button" data-variant="primary">Primary</button>
      <button class="blora-button" type="button" data-variant="secondary">Secondary</button>
      <button class="blora-button" type="button" data-variant="outline">Outline</button>
      <button class="blora-button" type="button" data-variant="ghost">Ghost</button>
      <button class="blora-button" type="button" data-variant="danger">Danger</button>
      <button class="blora-button" type="button" data-variant="text">Text</button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div class="blora-row">
      <button class="blora-button" type="button" data-size="xs">XS</button>
      <button class="blora-button" type="button" data-size="sm">Small</button>
      <button class="blora-button" type="button" data-size="md">Medium</button>
      <button class="blora-button" type="button" data-size="lg">Large</button>
      <button class="blora-button" type="button" data-size="xl">XLarge</button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div class="blora-row">
      <button class="blora-button" type="button" data-variant="primary" disabled>Primary</button>
      <button class="blora-button" type="button" data-variant="secondary" disabled>
        Secondary
      </button>
      <button class="blora-button" type="button" data-variant="outline" disabled>Outline</button>
      <button class="blora-button" type="button" data-variant="ghost" disabled>Ghost</button>
      <button class="blora-button" type="button" data-variant="danger" disabled>Danger</button>
    </div>
  `,
};

export const Loading: Story = {
  render: () => html`
    <div class="blora-row">
      <button
        class="blora-button"
        type="button"
        data-variant="primary"
        data-loading
        aria-busy="true"
      >
        Primary
      </button>
      <button
        class="blora-button"
        type="button"
        data-variant="secondary"
        data-loading
        aria-busy="true"
      >
        Secondary
      </button>
      <button
        class="blora-button"
        type="button"
        data-variant="outline"
        data-loading
        aria-busy="true"
      >
        Outline
      </button>
      <button
        class="blora-button"
        type="button"
        data-variant="danger"
        data-loading
        aria-busy="true"
      >
        Danger
      </button>
    </div>
  `,
};

export const IconButtons: Story = {
  render: () => html`
    <div class="blora-row">
      <button
        class="blora-button"
        type="button"
        data-variant="outline"
        data-size="icon"
        data-shape="square"
        aria-label="喜欢"
      >
        ${createBloraIcon("heart", 16)}
      </button>
      <button
        class="blora-button"
        type="button"
        data-variant="outline"
        data-size="icon"
        data-shape="circle"
        aria-label="喜欢"
      >
        ${createBloraIcon("heart", 16)}
      </button>
    </div>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <div class="blora-row">
      <button class="blora-button" type="button" data-variant="outline">
        ${createBloraIcon("heart", 16)} 喜欢
      </button>
      <button class="blora-button" type="button" data-variant="outline">
        喜欢 ${createBloraIcon("heart", 16)}
      </button>
    </div>
  `,
};

export const ButtonGroup: Story = {
  render: () => html`
    <div class="blora-button-group">
      <button class="blora-button" type="button" data-variant="outline">Left</button>
      <button class="blora-button" type="button" data-variant="outline">Center</button>
      <button class="blora-button" type="button" data-variant="outline">Right</button>
    </div>
  `,
};

/* Dark preview: use global scheme toggle (Add-ons/Theming), not a per-component strip. */
