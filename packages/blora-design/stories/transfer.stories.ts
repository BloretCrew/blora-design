import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraTransfer } from "../src/components/transfer";

defineBloraTransfer();

const meta = {
  title: "Data input/Transfer",
  component: "blora-transfer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-transfer source-label="候选" target-label="已选">
      <blora-transfer-item value="zhang">张三</blora-transfer-item>
      <blora-transfer-item value="li" checked>李四</blora-transfer-item>
      <blora-transfer-item value="wang">王五</blora-transfer-item>
      <blora-transfer-item value="zhao">赵六</blora-transfer-item>
      <blora-transfer-item value="qian">钱七</blora-transfer-item>
      <blora-transfer-item value="li" target checked>李四</blora-transfer-item>
    </blora-transfer>
  `,
};
