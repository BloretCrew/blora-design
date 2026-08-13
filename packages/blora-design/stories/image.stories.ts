import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Image",
  component: "blora-image",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div class="blora-row" style="flex-wrap: wrap; gap: var(--blora-space-4);">
      <blora-image
        src="https://picsum.photos/seed/blora-img1/400/280"
        alt="Hover zoom"
        caption="Hover zoom"
        variant="hover"
        style="width: 200px;"
      ></blora-image>
      <blora-image
        src="https://picsum.photos/seed/blora-img2/400/280"
        alt="Frame"
        variant="frame"
        style="width: 200px;"
      ></blora-image>
      <blora-image
        src="https://picsum.photos/seed/blora-img3/400/280"
        alt="Muted filter"
        variant="hover"
        filter="muted"
        style="width: 200px;"
      ></blora-image>
      <blora-image
        src="https://picsum.photos/seed/blora-img4/400/280"
        alt="Monochrome"
        variant="hover"
        filter="monochrome"
        style="width: 200px;"
      ></blora-image>
    </div>
  `,
};

export const Preview: Story = {
  render: () => html`
    <blora-image
      src="https://picsum.photos/seed/blora-preview/800/520"
      alt="Preview image"
      caption="Click to preview"
      variant="preview"
      preview
      style="width: 320px;"
    ></blora-image>
  `,
};

export const PreviewGroup: Story = {
  render: () => html\`<div class="blora-grid blora-grid--3"><blora-image src="/visual-baseline-light.png" alt="浅色视觉基线" preview preview-group="baselines"></blora-image><blora-image src="/visual-baseline-dark.png" alt="深色视觉基线" preview preview-group="baselines"></blora-image></div>\`,
};
