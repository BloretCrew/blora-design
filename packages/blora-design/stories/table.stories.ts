import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTableController } from "../src/components/table";

const meta = {
  title: "Data display/Table",
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
            <th data-sort data-col-key="name">Name</th>
            <th data-sort data-col-key="role">Role</th>
            <th data-sort data-col-key="status">Status</th>
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

/** Built-in row selection (data-blora-selectable) — injects Blora checkboxes */
export const Selectable: Story = {
  name: "Selectable rows",
  render: () => html`
    <div ${ref(init)}>
      <div class="blora-table-wrap" data-blora-selectable>
        <table class="blora-table" id="story-select-table">
          <thead>
            <tr>
              <th data-sort data-col-key="name">成员</th>
              <th data-sort data-col-key="dept">部门</th>
              <th data-sort data-col-key="task">事项</th>
              <th data-sort data-col-key="status">状态</th>
              <th data-sort data-col-key="score">评分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张三</td>
              <td>技术部</td>
              <td>前端框架搭建</td>
              <td>已完成</td>
              <td>5</td>
            </tr>
            <tr>
              <td>李四</td>
              <td>技术部</td>
              <td>接口文档撰写</td>
              <td>审核中</td>
              <td>5</td>
            </tr>
            <tr>
              <td>王五</td>
              <td>技术部</td>
              <td>数据库迁移</td>
              <td>待办</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
};

/** Column visibility + drag reorder (data-blora-cols) */
export const ColumnSettings: Story = {
  name: "Column settings",
  render: () => html`
    <div ${ref(init)}>
      <div class="blora-table-wrap" data-blora-cols data-blora-cols-key="story-table-cols">
        <table class="blora-table" id="story-cols-table">
          <thead>
            <tr>
              <th data-sort data-col-key="name">Name</th>
              <th data-sort data-col-key="role">Role</th>
              <th data-sort data-col-key="status">Status</th>
              <th data-col-key="dept">Dept</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>Admin</td>
              <td>Active</td>
              <td>Core</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>Editor</td>
              <td>Offline</td>
              <td>Docs</td>
            </tr>
            <tr>
              <td>Carol</td>
              <td>Guest</td>
              <td>Pending</td>
              <td>Ops</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
};

const virtualInit = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  const ctrl = createTableController(el);
  (el as any).__ctrl = ctrl;
  const rows = Array.from({ length: 500 }, (_, i) => [
    `User ${i + 1}`,
    i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Guest",
    i % 2 === 0 ? "Active" : "Offline",
  ]);
  ctrl.setRows(rows);
};

/** Vertical virtual scroll for large row sets */
export const VirtualScroll: Story = {
  name: "Virtual scroll (Y)",
  render: () => html`
    <div
      class="blora-table-wrap"
      data-blora-virtual
      data-virtual-axis="y"
      data-row-height="44"
      data-viewport-height="360"
      data-overscan="6"
      ${ref(virtualInit)}
    >
      <table class="blora-table">
        <thead>
          <tr>
            <th data-col-key="name">Name</th>
            <th data-col-key="role">Role</th>
            <th data-col-key="status">Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `,
};

const virtualBothInit = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  const ctrl = createTableController(el);
  (el as any).__ctrl = ctrl;
  const colCount = 40;
  const keys = Array.from({ length: colCount }, (_, c) => `c${c}`);
  const rows = Array.from({ length: 300 }, (_, r) => {
    const o: Record<string, string> = {};
    keys.forEach((k, c) => {
      o[k] = `R${r + 1}C${c + 1}`;
    });
    return o;
  });
  ctrl.setRows(rows, keys);
};

/**
 * Both axes: many rows + many columns.
 * Horizontal virtual kicks in when totalCols * colWidth > viewport (narrow / wide tables).
 */
export const VirtualScrollBoth: Story = {
  name: "Virtual scroll (X+Y)",
  render: () => html`
    <div
      class="blora-table-wrap"
      data-blora-virtual
      data-virtual-axis="both"
      data-row-height="40"
      data-col-width="100"
      data-viewport-height="320"
      data-overscan="4"
      style="max-width: 28rem;"
      ${ref(virtualBothInit)}
    >
      <table class="blora-table">
        <thead>
          <tr></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <p
      style="margin-top:0.75rem;font-size:var(--blora-text-xs);color:var(--blora-color-text-muted);"
    >
      容器约 28rem 宽、40 列 × 100px — 横向只渲染视口列；纵向 300 行只渲染视口行。
    </p>
  `,
};

export const Striped: Story = {
  render: () =>
    html`<div class="blora-table-wrap">
      <table class="blora-table" data-striped>
        <thead>
          <tr>
            <th>成员</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>Offline</td>
          </tr>
          <tr>
            <td>Carol</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>`,
};
