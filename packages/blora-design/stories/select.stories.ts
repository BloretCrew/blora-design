import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSelect } from "../src/components/select/index.js";

defineBloraSelect();

const meta = {
  title: "Data input/Select",
  component: "blora-select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Form-associated combobox with keyboard navigation and single or multiple selection.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-select placeholder="Choose a country">
      <blora-option value="cn">China</blora-option>
      <blora-option value="jp">Japan</blora-option>
      <blora-option value="us">United States</blora-option>
    </blora-select>
  `,
};

export const DisabledOption: Story = {
  render: () => html`
    <blora-select placeholder="Select an option">
      <blora-option value="a">Option A</blora-option>
      <blora-option value="b" disabled>Option B (disabled)</blora-option>
      <blora-option value="c">Option C</blora-option>
    </blora-select>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <blora-select placeholder="Disabled" disabled>
      <blora-option value="a">Option A</blora-option>
    </blora-select>
  `,
};

export const Multiple: Story = {
  render: () => html`
    <blora-select multiple max-tag-count="2" value="design,frontend,product" placeholder="Choose teams">
      <blora-option value="design">Design</blora-option>
      <blora-option value="frontend">Frontend</blora-option>
      <blora-option value="product">Product</blora-option>
      <blora-option value="research">Research</blora-option>
    </blora-select>
  `,
};
