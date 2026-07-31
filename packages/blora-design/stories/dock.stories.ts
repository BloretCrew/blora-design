import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDockController } from "../src/components/dock";

const meta = {
  title: "Navigation/Dock",
  component: ".blora-dock",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createDockController(el);
};

export const Default: Story = {
  render: () => html`
    <nav class="blora-dock blora-dock--static" aria-label="底部导航" ${ref(init)}>
      <a class="blora-dock__item" data-active href="#dock" style="text-decoration:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
        <span>首页</span>
      </a>
      <a class="blora-dock__item" href="#dock" style="text-decoration:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <span>搜索</span>
      </a>
      <a class="blora-dock__item" href="#dock" style="text-decoration:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
        <span>账户</span>
      </a>
      <a class="blora-dock__item" href="#dock" style="text-decoration:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>
        <span>设置</span>
      </a>
    </nav>
  `,
};
