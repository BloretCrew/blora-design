import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTextRotateController } from "../src/components/copy";

const meta = {
  title: "Typography/Text Rotate",
  component: ".blora-text-rotate",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTextRotateController(el);
};

export const Default: Story = {
  render: () => html`
    <p style="font-size: var(--blora-text-xl); font-weight: 600;">
      Blora Design 提供
      <span
        class="blora-text-rotate"
        style="color: var(--blora-color-action-primary-default);"
        data-interval="2200"
        ${ref(init)}
      >
        <span class="blora-text-rotate__item" data-active>清晰的产品界面</span>
        <span class="blora-text-rotate__item">一致的交互体验</span>
        <span class="blora-text-rotate__item">可复用的设计系统</span>
      </span>
    </p>
  `,
};
