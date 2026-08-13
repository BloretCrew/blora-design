import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraRate } from "../src/components/rate";

defineBloraRate();

const meta = {
  title: "Data input/Rate",
  component: "blora-rate",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<blora-rate value="4" label="评分"></blora-rate>`,
};

export const Readonly: Story = {
  render: () => html`<blora-rate value="3" readonly label="只读评分"></blora-rate>`,
};
