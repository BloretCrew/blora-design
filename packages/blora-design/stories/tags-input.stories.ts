import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraTagsInput } from "../src/components/tags-input";

defineBloraTagsInput();

const meta = {
  title: "Data input/Tags Input",
  component: "blora-tags-input",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<blora-tags-input values="React,Vue,Svelte" placeholder="添加标签..."></blora-tags-input>`,
};
