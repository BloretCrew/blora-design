import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraDrawer } from "../src/components/drawer";

defineBloraDrawer();

const meta = {
  title: "Layout/Drawer",
  component: "blora-drawer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

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
          const host = (e.target as HTMLElement).parentElement?.querySelector("blora-drawer") as
            (HTMLElement & { open(): void }) | null;
          host?.open();
        }}
      >
        打开（${label}）
      </button>
      <blora-drawer title="${label} 抽屉" position=${position}>
        打开/关闭均有动画。点击遮罩、关闭或 Esc 关闭。
      </blora-drawer>
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
