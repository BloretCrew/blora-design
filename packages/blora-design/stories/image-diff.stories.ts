import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createImageDiffController } from "../../../addons/effects/src/index";
import "../../../addons/effects/src/effects.css";

const meta = {
  title: "Data display/Diff",
  component: ".blora-diff",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createImageDiffController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-diff" ${ref(init)} style="max-width: 28rem;">
      <div class="blora-diff__item blora-diff__item--before">
        <div
          style="width:100%;height:100%;background:linear-gradient(135deg,#9F5964,#5D6680);"
        ></div>
      </div>
      <div class="blora-diff__item">
        <div
          style="width:100%;height:100%;background:linear-gradient(135deg,#5B756B,#303143);"
        ></div>
      </div>
      <div class="blora-diff__divider" aria-hidden="true"></div>
      <input
        class="blora-diff__range"
        type="range"
        min="0"
        max="100"
        value="50"
        aria-label="对比位置"
      />
    </div>
  `,
};

export const Content: Story = {
  render: () => html`
    <div class="blora-diff" ${ref(init)} style="max-width: 28rem; --blora-diff-ratio: 4 / 3;">
      <div class="blora-diff__item blora-diff__item--before">
        <article class="blora-card" data-variant="flat">
          <div class="blora-card__title">草稿</div>
          <div class="blora-card__body">标题和说明挤在一起，状态也不清楚。</div>
          <div class="blora-card__foot">
            <span class="blora-badge" data-variant="neutral">草稿</span>
          </div>
        </article>
      </div>
      <div class="blora-diff__item">
        <article class="blora-card">
          <div class="blora-card__title">已发布</div>
          <div class="blora-card__body">层级拆开，用正式标签表达状态。</div>
          <div class="blora-card__foot">
            <span class="blora-tag" data-variant="success">已发布</span>
          </div>
        </article>
      </div>
      <div class="blora-diff__divider" aria-hidden="true"></div>
      <input
        class="blora-diff__range"
        type="range"
        min="0"
        max="100"
        value="50"
        aria-label="对比位置"
      />
    </div>
  `,
};
