import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAnchorController, initSmoothScroll } from "../../../addons/layout/src/index";
import "../../../addons/layout/src/layout.css";

const meta = {
  title: "Add-ons/Layout/Anchor",
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
    <div style="display:grid;grid-template-columns:10rem 1fr;gap:1.5rem;max-width:40rem;">
      <nav class="blora-anchor" data-offset="24" ${ref(init)}>
        <a href="#sec-a">第一节</a>
        <a href="#sec-b">第二节</a>
        <a href="#sec-c">第三节</a>
      </nav>
      <div style="max-height:16rem;overflow:auto;padding-inline-end:0.5rem;">
        <section id="sec-a" style="min-height:10rem;scroll-margin-top:1rem;">
          <h3 class="blora-h3">第一节</h3>
          <p class="blora-text-sm">内容 A…</p>
        </section>
        <section id="sec-b" style="min-height:10rem;scroll-margin-top:1rem;">
          <h3 class="blora-h3">第二节</h3>
          <p class="blora-text-sm">内容 B…</p>
        </section>
        <section id="sec-c" style="min-height:10rem;scroll-margin-top:1rem;">
          <h3 class="blora-h3">第三节</h3>
          <p class="blora-text-sm">内容 C…</p>
        </section>
      </div>
    </div>
  `,
};
