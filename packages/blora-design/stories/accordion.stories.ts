import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraAccordion } from "../src/components/accordion";

defineBloraAccordion();

const meta = {
  title: "Data display/Accordion",
  component: "blora-accordion",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-accordion style="max-width: 24rem;">
      <blora-accordion-item heading="什么是响应式布局？" open>
        响应式布局是指页面能根据设备屏幕尺寸自动调整布局。通过 CSS Flexbox 和 Grid 实现适配。
      </blora-accordion-item>
      <blora-accordion-item heading="什么是 Flexbox？">
        Flexbox 是一维布局模型，适用于行或列方向的排列。通过 display:flex 启用，提供对齐与分布能力。
      </blora-accordion-item>
      <blora-accordion-item heading="什么是 Grid 布局？">
        Grid 是二维布局模型，同时控制行和列。适用于复杂页面分区和仪表盘等场景。
      </blora-accordion-item>
    </blora-accordion>
  `,
};
