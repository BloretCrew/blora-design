import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTableController } from "../src/components/table";

const meta = {
  title: "Data/Table",
  component: ".blora-table",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTableController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-table-wrap" ${ref(init)}>
      <table class="blora-table">
        <thead>
          <tr>
            <th data-sort>Name</th>
            <th data-sort>Role</th>
            <th data-sort>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>Admin</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>Editor</td>
            <td>Offline</td>
          </tr>
          <tr>
            <td>Carol</td>
            <td>Guest</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>Dave</td>
            <td>Editor</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
