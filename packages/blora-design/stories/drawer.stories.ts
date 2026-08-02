import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDrawerController } from "../src/components/drawer";

const meta = {
  title: "Navigation/Drawer",
  component: ".blora-drawer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const bind = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  const ctrl = createDrawerController(el);
  (el as any).__ctrl = ctrl;
  // demo open by default for visual QA
  ctrl.open();
};

export const Right: Story = {
  render: () => html`
    <div style="position:relative;height:320px;overflow:hidden;border-radius:var(--blora-radius-lg);border:1px solid var(--blora-color-border-subtle);">
      <button type="button" class="blora-button" data-variant="outline" style="margin:1rem"
        @click=${(e: Event) => {
          const host = (e.target as HTMLElement).parentElement?.querySelector(".blora-drawer");
          (host as any)?.__ctrl?.open();
        }}>打开抽屉</button>
      <div class="blora-drawer" data-position="right" ${ref(bind)}>
        <div class="blora-drawer__mask"></div>
        <div class="blora-drawer__panel">
          <div style="padding:var(--blora-space-5);">
            <h3 style="margin:0 0 var(--blora-space-3);font-family:var(--blora-font-heading);">侧栏标题</h3>
            <p style="margin:0 0 var(--blora-space-4);font-size:var(--blora-text-sm);color:var(--blora-color-text-emphasis);">
              点击遮罩或 Esc 关闭。
            </p>
            <button type="button" class="blora-button" data-variant="primary" data-blora-close>关闭</button>
          </div>
        </div>
      </div>
    </div>
  `,
};
