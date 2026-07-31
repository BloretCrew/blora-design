import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDropdownController } from "../src/components/dropdown";

const meta = {
  title: "Navigation/Dropdown",
  component: ".blora-dropdown",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Initialize the dropdown controller on a root element. */
const initDropdown = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  const prev = (el as HTMLElement & { __dropdownController?: { destroy: () => void } })
    .__dropdownController;
  prev?.destroy();
  (el as HTMLElement & { __dropdownController?: { destroy: () => void } }).__dropdownController =
    createDropdownController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-dropdown" ${ref(initDropdown)}>
      <button class="blora-button" type="button" data-variant="outline" data-dropdown-trigger>
        下拉菜单 ▾
      </button>
      <div class="blora-dropdown__menu">
        <a class="blora-dropdown__item" href="#">操作一</a>
        <a class="blora-dropdown__item" href="#">操作二</a>
        <a class="blora-dropdown__item" href="#">操作三</a>
      </div>
    </div>
  `,
};

export const WithSeparator: Story = {
  render: () => html`
    <div class="blora-dropdown" ${ref(initDropdown)}>
      <button class="blora-button" type="button" data-variant="outline" data-dropdown-trigger>
        操作菜单 ▾
      </button>
      <div class="blora-dropdown__menu">
        <a class="blora-dropdown__item" href="#">编辑</a>
        <a class="blora-dropdown__item" href="#">复制</a>
        <div class="blora-dropdown__sep"></div>
        <a class="blora-dropdown__item" href="#">删除</a>
      </div>
    </div>
  `,
};
