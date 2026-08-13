import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = { title: "Data display/Media Container", component: ".blora-media", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;
export const Ratios: Story = {
  render: () => html`
    <div class="blora-grid blora-grid--3">
      <figure class="blora-stack blora-stack--sm">
        <div class="blora-media" data-ratio="square">
          <img src="https://picsum.photos/seed/blora-media-sq/640/640" alt="1 比 1 裁切" />
        </div>
        <figcaption class="blora-text-muted blora-text-center">1 : 1</figcaption>
      </figure>
      <figure class="blora-stack blora-stack--sm">
        <div class="blora-media" data-ratio="video">
          <img src="https://picsum.photos/seed/blora-media-hd/960/540" alt="16 比 9 裁切" />
        </div>
        <figcaption class="blora-text-muted blora-text-center">16 : 9</figcaption>
      </figure>
      <figure class="blora-stack blora-stack--sm">
        <div class="blora-media" data-ratio="portrait">
          <img src="https://picsum.photos/seed/blora-media-pt/720/960" alt="3 比 4 裁切" />
        </div>
        <figcaption class="blora-text-muted blora-text-center">3 : 4</figcaption>
      </figure>
    </div>
  `,
};
