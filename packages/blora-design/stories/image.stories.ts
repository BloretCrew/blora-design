import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Image",
  component: ".blora-image",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' fill='%23d9cfd3'%3E%3Crect width='400' height='240'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23fff' text-anchor='middle' dy='.35em'%3E400×240%3C/text%3E%3C/svg%3E";

export const Variants: Story = {
  render: () => html`
    <div class="blora-row" style="flex-wrap: wrap; gap: var(--blora-space-4);">
      <figure class="blora-image" style="width: 200px; margin: 0;">
        <img src=${placeholder} alt="默认图片" />
      </figure>
      <figure class="blora-image" data-variant="hover" style="width: 200px; margin: 0;">
        <img src=${placeholder} alt="悬停缩放" />
        <figcaption class="blora-image__cap">悬停放大</figcaption>
      </figure>
      <figure class="blora-image" data-variant="frame" style="width: 200px; margin: 0;">
        <img src=${placeholder} alt="相框模式" />
      </figure>
      <figure class="blora-image" data-filter="muted" style="width: 200px; margin: 0;">
        <img src=${placeholder} alt="柔和滤镜" />
      </figure>
      <figure class="blora-image" data-filter="monochrome" style="width: 200px; margin: 0;">
        <img src=${placeholder} alt="单色滤镜" />
      </figure>
    </div>
  `,
};
