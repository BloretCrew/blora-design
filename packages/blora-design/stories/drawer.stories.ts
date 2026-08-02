import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDrawerController } from "../src/components/drawer";

const meta = {
  title: "Feedback/Drawer",
  component: ".blora-drawer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const bind = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createDrawerController(el);
};

function demoShell(position: "right" | "left" | "top" | "bottom", label: string) {
  return html`
    <div
      style="position:relative;height:320px;overflow:hidden;border-radius:var(--blora-radius-lg);border:1px solid var(--blora-color-border-subtle);"
    >
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        style="margin:1rem"
        @click=${(e: Event) => {
          const host = (e.target as HTMLElement).parentElement?.querySelector(".blora-drawer");
          (host as any)?.__ctrl?.open();
        }}
      >
        打开（${label}）
      </button>
      <div class="blora-drawer" data-position=${position} ${ref(bind)}>
        <div class="blora-drawer__mask"></div>
        <div class="blora-drawer__panel">
          <div class="blora-drawer__header">
            <h3 class="blora-drawer__title">${label} 抽屉</h3>
            <button type="button" class="blora-drawer__close" data-blora-close aria-label="关闭">
              ×
            </button>
          </div>
          <div class="blora-drawer__body">
            <p
              style="margin:0 0 var(--blora-space-4);font-size:var(--blora-text-sm);color:var(--blora-color-text-emphasis);"
            >
              打开/关闭均有动画。点击遮罩、关闭或 Esc 关闭。
            </p>
            <button type="button" class="blora-button" data-variant="primary" data-blora-close>
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const Right: Story = {
  render: () => demoShell("right", "右侧"),
};

export const Left: Story = {
  render: () => demoShell("left", "左侧"),
};

export const Top: Story = {
  render: () => demoShell("top", "顶部"),
};

export const Bottom: Story = {
  render: () => demoShell("bottom", "底部"),
};
