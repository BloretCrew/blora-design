import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAnchorController, initSmoothScroll } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Layout/Anchor",
  component: ".blora-anchor",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  initSmoothScroll(el.ownerDocument);
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createAnchorController(el);
};

export const Default: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 1.5rem; max-width: 42rem; align-items: start;"
    >
      <nav class="blora-anchor" data-offset="80" ${ref(init)} style="position: sticky; top: 1rem;">
        <a class="blora-anchor__link" href="#blora-sec-a">Section A</a>
        <a class="blora-anchor__link" href="#blora-sec-b">Section B</a>
        <a class="blora-anchor__link" href="#blora-sec-c">Section C</a>
      </nav>
      <div>
        <section id="blora-sec-a" style="min-height: 70vh; scroll-margin-top: 1.5rem;">
          <h3 class="blora-h3">Section A</h3>
          <p class="blora-text-sm" style="color: var(--blora-color-text-muted);">
            Click a nav link to smooth-scroll here. Keep scrolling to see the active state update.
          </p>
        </section>
        <section id="blora-sec-b" style="min-height: 70vh; scroll-margin-top: 1.5rem;">
          <h3 class="blora-h3">Section B</h3>
          <p class="blora-text-sm" style="color: var(--blora-color-text-muted);">Content B</p>
        </section>
        <section id="blora-sec-c" style="min-height: 70vh; scroll-margin-top: 1.5rem;">
          <h3 class="blora-h3">Section C</h3>
          <p class="blora-text-sm" style="color: var(--blora-color-text-muted);">Content C</p>
        </section>
      </div>
    </div>
  `,
};
