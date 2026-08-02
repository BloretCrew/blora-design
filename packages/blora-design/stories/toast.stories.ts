import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";
import { toast } from "../src/components/toast";

const meta = {
  title: "Feedback/Toast",
  component: ".blora-toast",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const successIcon = svg`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
const closeIcon = svg`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

export const StaticVariants: Story = {
  name: "Static variants",
  render: () => html`
    <div class="blora-stack" style="max-width: 24rem;">
      <div class="blora-toast" data-variant="success">
        <span class="blora-toast__icon">${successIcon}</span>
        <div class="blora-toast__body">
          <div class="blora-toast__title">保存成功</div>
          <div class="blora-toast__desc">文档已保存至云端。</div>
        </div>
        <button class="blora-toast__close" aria-label="关闭">${closeIcon}</button>
      </div>
      <div class="blora-toast" data-variant="danger">
        <div class="blora-toast__body">
          <div class="blora-toast__title">操作失败</div>
          <div class="blora-toast__desc">网络异常，请稍后重试。</div>
        </div>
      </div>
    </div>
  `,
};

export const LiveAPI: Story = {
  name: "API toast()",
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <button
        type="button"
        class="blora-button"
        data-variant="primary"
        @click=${() => toast({ message: "保存成功", type: "success" })}
      >
        成功 Toast
      </button>
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        @click=${() => toast({ message: "请注意磁盘空间", type: "warning" })}
      >
        警告
      </button>
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        @click=${() => toast({ message: "网络异常", type: "danger", duration: 5000 })}
      >
        错误
      </button>
    </div>
  `,
};
