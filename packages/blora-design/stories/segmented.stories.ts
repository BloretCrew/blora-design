import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSegmented } from "../src/components/segmented";

defineBloraSegmented();

const meta = {
  title: "Navigation/Segmented",
  component: "blora-segmented",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-segmented value="day" style="max-width: 20rem;">
      <blora-segment value="day">日</blora-segment>
      <blora-segment value="week">周</blora-segment>
      <blora-segment value="month">月</blora-segment>
    </blora-segmented>
  `,
};
