import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraUpload } from "../src/components/upload";

defineBloraUpload();

const meta = {
  title: "Data input/Upload",
  component: "blora-upload",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<blora-upload
      prompt="拖拽文件至此"
      hint="支持 SVG / PNG / JPG · 单文件 ≤ 8MB"
      accept=".svg,.png,.jpg,.jpeg"
      multiple
    ></blora-upload>`,
};

export const CompactFilePicker: Story = {
  render: () => html\`
    <blora-upload
      variant="compact"
      prompt="选择附件"
      hint="支持 PDF / ZIP · 单文件 ≤ 20MB"
      accept=".pdf,.zip"
    ></blora-upload>
  \`,
};
