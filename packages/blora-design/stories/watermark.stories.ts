import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Watermark",
  component: ".blora-watermark",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-watermark"
      style="position: relative; padding: var(--blora-space-6); background: var(--blora-color-surface-default); border: var(--blora-border-subtle); border-radius: var(--blora-radius-md); min-height: 160px;"
    >
      <p class="blora-text-sm">
        这是受水印保护的内容区域。水印文字会以重复、半透明、倾斜的方式覆盖在内容上方。
      </p>
      <p class="blora-text-sm" style="margin-top: var(--blora-space-2);">
        Blora Design 内部文档 - 请勿外传
      </p>
      <div
        style="position: absolute; inset: 0; pointer-events: none; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4rem; opacity: 0.06; transform: rotate(-25deg); overflow: hidden;"
      >
        ${Array.from({ length: 12 }, () => html`<span style="font-size: 1.5rem; font-weight: 700; white-space: nowrap;">Blora Design</span>`)}
      </div>
    </div>
  `,
};
