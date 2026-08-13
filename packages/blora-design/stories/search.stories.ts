import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSearch } from "../src/components/search";

defineBloraSearch();

const meta = {
  title: "Data input/Search",
  component: "blora-search",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-search
      name="query"
      placeholder="搜索项目、用户…"
      style="max-width: 20rem;"
    ></blora-search>
  `,
};
