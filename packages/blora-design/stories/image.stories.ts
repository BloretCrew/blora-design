import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Image",
  component: ".blora-image",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div class="blora-row" style="flex-wrap: wrap; gap: var(--blora-space-4);">
      <figure class="blora-image" data-variant="hover" style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img1/400/280" alt="悬停放大" />
        <figcaption class="blora-image__cap">悬停放大</figcaption>
      </figure>
      <figure class="blora-image" data-variant="frame" style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img2/400/280" alt="相框模式" />
      </figure>
      <figure class="blora-image" data-variant="hover" data-filter="muted" style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img3/400/280" alt="柔和滤镜" />
      </figure>
      <figure class="blora-image" data-variant="hover" data-filter="monochrome" style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img4/400/280" alt="单色滤镜" />
      </figure>
    </div>
  `,
};
