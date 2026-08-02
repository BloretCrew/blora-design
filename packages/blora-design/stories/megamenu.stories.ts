import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createMegamenuController } from "../src/components/dock";

const meta = {
  title: "Navigation/Megamenu",
  component: ".blora-megamenu",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createMegamenuController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-megamenu" data-blora-megamenu ${ref(init)} style="margin-bottom: 14rem;">
      <button
        class="blora-button blora-megamenu__trigger"
        data-variant="outline"
        type="button"
        data-blora-megamenu-trigger
      >
        浏览产品
      </button>
      <div class="blora-megamenu__panel">
        <div class="blora-megamenu__grid">
          <div>
            <div class="blora-megamenu__title">工作</div>
            <a class="blora-megamenu__link" href="#buttons">项目管理</a>
            <a class="blora-megamenu__link" href="#buttons">任务中心</a>
          </div>
          <div>
            <div class="blora-megamenu__title">数据</div>
            <a class="blora-megamenu__link" href="#data">分析面板</a>
            <a class="blora-megamenu__link" href="#data">导出记录</a>
          </div>
          <div>
            <div class="blora-megamenu__title">支持</div>
            <a class="blora-megamenu__link" href="#feedback">帮助中心</a>
            <a class="blora-megamenu__link" href="#feedback">服务状态</a>
          </div>
        </div>
      </div>
    </div>
  `,
};
