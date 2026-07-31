import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Data/Tree", component: ".blora-tree", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-tree">
      <div class="blora-tree__node">
        <span class="blora-tree__toggle">▾</span>
        <span class="blora-tree__label">src</span>
      </div>
      <div class="blora-tree__children">
        <div class="blora-tree__node">
          <span class="blora-tree__toggle">▾</span>
          <span class="blora-tree__label">components</span>
        </div>
        <div class="blora-tree__children">
          <div class="blora-tree__node">
            <span class="blora-tree__toggle" style="visibility: hidden;">▸</span>
            <span class="blora-tree__label" data-selected>button.css</span>
          </div>
          <div class="blora-tree__node">
            <span class="blora-tree__toggle" style="visibility: hidden;">▸</span>
            <span class="blora-tree__label">dialog.ts</span>
          </div>
        </div>
        <div class="blora-tree__node">
          <span class="blora-tree__toggle">▸</span>
          <span class="blora-tree__label">index.ts</span>
        </div>
      </div>
    </div>
  `,
};
