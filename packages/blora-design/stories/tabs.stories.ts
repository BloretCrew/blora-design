import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraTabs } from "../src/components/tabs";

defineBloraTabs();

const meta = {
  title: "Navigation/Tabs",
  component: "blora-tabs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const tabs = (attributes: { flush?: boolean; orientation?: string; variant?: string } = {}) => html`
  <blora-tabs
    ?flush=${attributes.flush}
    variant=${attributes.variant ?? "default"}
    orientation=${attributes.orientation ?? "horizontal"}
  >
    <blora-tab label="概览" value="overview" selected>概览内容区域</blora-tab>
    <blora-tab label="活动" value="activity">活动内容区域</blora-tab>
    <blora-tab label="设置" value="settings">设置内容区域</blora-tab>
  </blora-tabs>
`;

export const Default: Story = { render: () => tabs() };
export const Pills: Story = { render: () => tabs({ variant: "pills" }) };
export const Vertical: Story = { render: () => tabs({ orientation: "vertical" }) };
export const FullBleed: Story = { render: () => tabs({ flush: true }) };
