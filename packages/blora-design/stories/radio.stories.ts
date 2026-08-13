import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraRadio } from "../src/components/radio";

defineBloraRadio();

const meta = {
  title: "Data input/Radio",
  component: "blora-radio",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <blora-radio name="r1" value="a" checked>选项 A</blora-radio>
      <blora-radio name="r1" value="b">选项 B</blora-radio>
      <blora-radio name="r1" value="c" disabled>选项 C (禁用)</blora-radio>
    </div>
  `,
};
