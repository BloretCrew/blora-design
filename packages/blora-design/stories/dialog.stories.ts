import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraDialog } from "../src/components/dialog/index.js";

defineBloraDialog();

const meta = {
  title: "Feedback/Dialog",
  component: "blora-dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog with focus trap, Escape to close, scroll lock, and overlay stack support.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <button class="blora-button" type="button" data-variant="primary" id="open-dialog-1">
      Open Dialog
    </button>
    <blora-dialog id="dialog-1">
      <span slot="title">Confirm Action</span>
      <p>Are you sure you want to proceed? This action cannot be undone.</p>
      <div slot="footer">
        <button
          class="blora-button"
          type="button"
          data-variant="ghost"
          onclick="document.getElementById('dialog-1').close()"
        >
          Cancel
        </button>
        <button
          class="blora-button"
          type="button"
          data-variant="primary"
          onclick="document.getElementById('dialog-1').close()"
        >
          Confirm
        </button>
      </div>
    </blora-dialog>
    <script>
      document.getElementById("open-dialog-1")?.addEventListener("click", () => {
        document.getElementById("dialog-1")?.show();
      });
    </script>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div class="blora-row">
      <button class="blora-button" type="button" data-variant="outline" id="open-sm">Small</button>
      <button class="blora-button" type="button" data-variant="outline" id="open-md">Medium</button>
      <button class="blora-button" type="button" data-variant="outline" id="open-lg">Large</button>
    </div>
    <blora-dialog id="dialog-sm" size="sm">
      <span slot="title">Small Dialog</span>
      <p>This is a small dialog (400px max width).</p>
    </blora-dialog>
    <blora-dialog id="dialog-md" size="md">
      <span slot="title">Medium Dialog</span>
      <p>This is a medium dialog (520px max width).</p>
    </blora-dialog>
    <blora-dialog id="dialog-lg" size="lg">
      <span slot="title">Large Dialog</span>
      <p>This is a large dialog (800px max width).</p>
    </blora-dialog>
    <script>
      document
        .getElementById("open-sm")
        ?.addEventListener("click", () => document.getElementById("dialog-sm")?.show());
      document
        .getElementById("open-md")
        ?.addEventListener("click", () => document.getElementById("dialog-md")?.show());
      document
        .getElementById("open-lg")
        ?.addEventListener("click", () => document.getElementById("dialog-lg")?.show());
    </script>
  `,
};

export const NoCloseOnOutside: Story = {
  render: () => html`
    <button class="blora-button" type="button" data-variant="primary" id="open-persistent">
      Open Persistent Dialog
    </button>
    <blora-dialog id="dialog-persistent" close-on-outside-click="false">
      <span slot="title">Persistent Dialog</span>
      <p>Clicking outside will not close this dialog. Use the close button or Escape.</p>
      <div slot="footer">
        <button
          class="blora-button"
          type="button"
          data-variant="primary"
          onclick="document.getElementById('dialog-persistent').close()"
        >
          OK
        </button>
      </div>
    </blora-dialog>
    <script>
      document.getElementById("open-persistent")?.addEventListener("click", () => {
        document.getElementById("dialog-persistent")?.show();
      });
    </script>
  `,
};
