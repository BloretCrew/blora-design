import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { renderQRCode } from "../../../addons/qrcode/src/index";
import "../../../addons/qrcode/src/qrcode.css";

const meta = {
  title: "Add-ons/QRCode",
  component: ".blora-qrcode",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  el.replaceChildren();
  renderQRCode(el, "https://blora.design", { size: 160 });
};

export const Default: Story = {
  render: () => html`
    <div class="blora-qrcode" ${ref(init)} aria-label="二维码"></div>
  `,
};
