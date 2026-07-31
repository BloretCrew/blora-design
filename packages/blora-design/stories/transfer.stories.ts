import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Transfer",
  component: ".blora-transfer",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-transfer">
      <div class="blora-transfer__panel">
        <div class="blora-transfer__header">
          <label class="blora-checkbox"
            ><input type="checkbox" /><span class="blora-checkbox__box"></span
          ></label>
          <span>列表 1</span>
          <span class="blora-text-muted">2/4</span>
        </div>
        <div class="blora-transfer__list">
          <label class="blora-transfer__row"
            ><input type="checkbox" checked /><span class="blora-transfer__check"></span
            ><span>React</span></label
          >
          <label class="blora-transfer__row"
            ><input type="checkbox" checked /><span class="blora-transfer__check"></span
            ><span>Vue</span></label
          >
          <label class="blora-transfer__row"
            ><input type="checkbox" /><span class="blora-transfer__check"></span
            ><span>Angular</span></label
          >
          <label class="blora-transfer__row"
            ><input type="checkbox" /><span class="blora-transfer__check"></span
            ><span>Svelte</span></label
          >
        </div>
      </div>
      <div class="blora-transfer__actions">
        <button class="blora-button" data-variant="outline" data-size="sm" type="button">→</button>
        <button class="blora-button" data-variant="outline" data-size="sm" type="button">←</button>
      </div>
      <div class="blora-transfer__panel">
        <div class="blora-transfer__header">
          <label class="blora-checkbox"
            ><input type="checkbox" /><span class="blora-checkbox__box"></span
          ></label>
          <span>列表 2</span>
          <span class="blora-text-muted">0/2</span>
        </div>
        <div class="blora-transfer__list">
          <label class="blora-transfer__row"
            ><input type="checkbox" /><span class="blora-transfer__check"></span
            ><span>Lit</span></label
          >
          <label class="blora-transfer__row"
            ><input type="checkbox" /><span class="blora-transfer__check"></span
            ><span>Stencil</span></label
          >
        </div>
      </div>
    </div>
  `,
};
