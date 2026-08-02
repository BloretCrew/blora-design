import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createImageController } from "../src/components/image";

const meta = {
  title: "Data/Image",
  component: ".blora-image",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createImageController(el);
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-row" style="flex-wrap: wrap; gap: var(--blora-space-4);" ${ref(init)}>
      <figure class="blora-image" data-variant="hover" data-loading style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img1/400/280" alt="Hover zoom" />
        <figcaption class="blora-image__cap">Hover zoom</figcaption>
      </figure>
      <figure class="blora-image" data-variant="frame" data-loading style="width: 200px; margin: 0;">
        <img src="https://picsum.photos/seed/blora-img2/400/280" alt="Frame" />
      </figure>
      <figure
        class="blora-image"
        data-variant="hover"
        data-filter="muted"
        data-loading
        style="width: 200px; margin: 0;"
      >
        <img src="https://picsum.photos/seed/blora-img3/400/280" alt="Muted filter" />
      </figure>
      <figure
        class="blora-image"
        data-variant="hover"
        data-filter="monochrome"
        data-loading
        style="width: 200px; margin: 0;"
      >
        <img src="https://picsum.photos/seed/blora-img4/400/280" alt="Monochrome" />
      </figure>
    </div>
  `,
};
