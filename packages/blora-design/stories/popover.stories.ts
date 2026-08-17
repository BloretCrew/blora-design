import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraPopover } from "../src/components/popover";

defineBloraPopover();

const meta = {
  title: "Actions/Popover",
  component: "blora-popover",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="padding: 2rem; text-align: start;">
      <blora-popover
        trigger="Open Popover"
        content="Panel left-aligned with the trigger button."
      ></blora-popover>
    </div>
  `,
};
