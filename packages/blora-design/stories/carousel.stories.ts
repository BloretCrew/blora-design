import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Carousel",
  component: "blora-carousel",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const slide = (label: string, background: string, color = "var(--blora-color-text-emphasis)") =>
  html`<blora-carousel-slide label=${label}>
    <div
      style="height: 240px; display: grid; place-items: center; background: ${background}; color: ${color}; border-radius: var(--blora-radius-md); font-family: var(--blora-font-display); font-size: 2rem;"
    >
      ${label}
    </div>
  </blora-carousel-slide>`;

export const Default: Story = {
  render: () => html`
    <blora-carousel label="项目轮播">
      ${slide("项目概览", "var(--blora-color-surface-sunken)")}
      ${slide(
        "数据展示",
        "var(--blora-color-action-primary-default)",
        "var(--blora-color-text-on-accent)",
      )}
      ${slide("图表分析", "var(--blora-color-status-info)", "var(--blora-color-text-on-accent)")}
    </blora-carousel>
  `,
};

export const Autoplay: Story = {
  render: () => html`
    <blora-carousel label="自动轮播" autoplay>
      ${slide("幻灯片 A", "var(--blora-color-surface-sunken)")}
      ${slide(
        "幻灯片 B",
        "var(--blora-color-action-primary-default)",
        "var(--blora-color-text-on-accent)",
      )}
      ${slide("幻灯片 C", "var(--blora-color-status-success)", "var(--blora-color-text-on-accent)")}
    </blora-carousel>
  `,
};
