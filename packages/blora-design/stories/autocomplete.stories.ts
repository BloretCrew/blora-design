import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createAutocompleteController } from "../src/components/autocomplete";

const meta = {
  title: "Forms/Autocomplete",
  component: ".blora-autocomplete",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createAutocompleteController(el);
};

export const Default: Story = {
  render: () => html`
    <div
      class="blora-autocomplete"
      data-options='["Blora Design","Button","Badge","Drawer","Modal","Table","Toast"]'
      style="max-width: 22rem;"
      ${ref(init)}
    >
      <label class="blora-label">AutoComplete</label>
      <input class="blora-input" type="search" placeholder="搜索组件…" autocomplete="off" />
    </div>
  `,
};
