import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraCopy } from "../src/components/copy";

defineBloraCopy();

const meta = {
  title: "Actions/Copy",
  component: "blora-copy",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<blora-copy text="npm i @bloret-crew/blora-design" label="复制"></blora-copy>`,
};
