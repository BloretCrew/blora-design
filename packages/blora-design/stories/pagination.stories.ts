import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraPagination } from "../src/components/pagination";

defineBloraPagination();

const meta = {
  title: "Navigation/Pagination",
  component: "blora-pagination",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<blora-pagination label="分页" page="1" total="5"></blora-pagination>`,
};

export const EllipsisWindow: Story = {
  render: () => html`<blora-pagination label="分页" page="7" total="12" max-visible="7"></blora-pagination>`,
};
