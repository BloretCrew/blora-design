import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAffixController } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Add-ons/Layout/Affix",
  component: ".blora-affix",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createAffixController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="padding: var(--blora-space-4); min-height: 120vh;">
      <p class="blora-text-sm blora-text-muted">向下滚动页面，固钉在到达阈值后吸附顶部。</p>
      <div style="height: 8rem;"></div>
      <div class="blora-affix" data-offset="16" ${ref(init)}>
        <div
          class="blora-affix__inner"
          style="background: var(--blora-color-surface-default); border: 1px solid var(--blora-color-border-subtle); border-radius: var(--blora-radius-md); padding: var(--blora-space-3);"
        >
          <span class="blora-text-sm" style="font-weight: 500;">固钉栏 · Affix</span>
        </div>
      </div>
      <div style="height: 80vh;"></div>
      <p class="blora-text-sm blora-text-muted">页面底部</p>
    </div>
  `,
};
