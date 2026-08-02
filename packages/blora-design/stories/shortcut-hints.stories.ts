import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { initShortcutHints } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Add-ons/Effects/Shortcut Hints",
  component: "[data-blora-shortcut]",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  initShortcutHints(el);
};

export const Default: Story = {
  render: () => html`
    <div ${ref(init)} style="display:flex;flex-direction:column;gap:0.75rem;">
      <div>保存 <kbd data-blora-shortcut="mod+s"></kbd></div>
      <div>命令面板 <kbd data-blora-shortcut="mod+k"></kbd></div>
      <div>撤销 <kbd data-blora-shortcut="mod+shift+z"></kbd></div>
    </div>
  `,
};
