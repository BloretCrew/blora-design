import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { createBloraIcon } from "../src/core/icons";

const meta = {
  title: "Actions/FAB",
  component: ".blora-fab",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-row" style="gap: var(--blora-space-4); align-items: center;">
      <button class="blora-fab blora-fab--static" type="button" aria-label="添加">
        ${createBloraIcon("plus", 22)}
      </button>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row" style="gap: var(--blora-space-4); align-items: center;">
      <button class="blora-fab blora-fab--static" type="button" aria-label="主色">
        ${createBloraIcon("plus", 22)}
      </button>
      <button
        class="blora-fab blora-fab--static"
        type="button"
        data-variant="surface"
        aria-label="浅色"
      >
        ${createBloraIcon("menu", 22)}
      </button>
    </div>
  `,
};
