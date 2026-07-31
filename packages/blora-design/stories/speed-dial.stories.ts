import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ref } from "lit/directives/ref.js";
import { createSpeedDialController } from "../src/components/dock";

const meta = {
  title: "Navigation/Speed Dial",
  component: ".blora-speed-dial",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const initAll = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  el.querySelectorAll(".blora-speed-dial").forEach((d) => {
    const dial = d as HTMLElement;
    (dial as any).__ctrl?.destroy();
    (dial as any).__ctrl = createSpeedDialController(dial);
  });
};

const plus =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const close =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const camera =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';
const gallery =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20"/></svg>';
const mic =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4M8 23h8"/></svg>';
const doc =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
const upload =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>';
const share =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';
const edit =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const copy =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const del =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';
const send =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const msg =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const mail =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>';
const phone =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>';
const home =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>';
const search =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
const star =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.47 6.04.88-4.37 4.26 1.03 6.02L12 16.79l-5.4 2.84 1.03-6.02-4.37-4.26 6.04-.88z"/></svg>';
const settings =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
const vote =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>';

const trig = (icon: string) =>
  html`<button
    class="blora-button blora-speed-dial__trigger"
    data-size="icon"
    data-variant="primary"
    type="button"
    aria-label="操作"
  >
    ${unsafeHTML(icon)}
  </button>`;
const act = (icon: string, label: string) =>
  html`<button
    class="blora-button blora-speed-dial__action"
    data-size="icon"
    data-variant="secondary"
    type="button"
    aria-label=${label}
    title=${label}
  >
    ${unsafeHTML(icon)}
  </button>`;
const labeledAct = (icon: string, label: string) =>
  html`<div class="blora-speed-dial__item">
    <span class="blora-speed-dial__label">${label}</span>${act(icon, label)}
  </div>`;

const stage = (label: string, content: unknown) =>
  html` <div class="blora-speed-dial-stage">
    <p class="blora-speed-dial-stage__label">${label}</p>
    ${content}
  </div>`;

export const Default: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--blora-space-6); padding: var(--blora-space-6);"
      ${ref(initAll)}
    >
      ${stage(
        "垂直 · 图标",
        html`<div class="blora-speed-dial">
          ${trig(plus)}
          <div class="blora-speed-dial__actions">
            ${act(camera, "拍照")}${act(gallery, "图库")}${act(mic, "语音")}
          </div>
        </div>`,
      )}
      ${stage(
        "垂直 · 标签",
        html`<div class="blora-speed-dial">
          ${trig(plus)}
          <div class="blora-speed-dial__actions">
            ${labeledAct(doc, "新建文档")}${labeledAct(upload, "上传文件")}${labeledAct(share, "分享")}
          </div>
        </div>`,
      )}
      ${stage(
        "垂直 · 矩形按钮",
        html`<div class="blora-speed-dial">
          ${trig(plus)}
          <div class="blora-speed-dial__actions">
            <button
              class="blora-button blora-speed-dial__action"
              data-size="sm"
              data-variant="secondary"
              type="button"
            >
              新建项目</button
            ><button
              class="blora-button blora-speed-dial__action"
              data-size="sm"
              data-variant="secondary"
              type="button"
            >
              导入数据</button
            ><button
              class="blora-button blora-speed-dial__action"
              data-size="sm"
              data-variant="secondary"
              type="button"
            >
              导出报告
            </button>
          </div>
        </div>`,
      )}
      ${stage(
        "标签 · 关闭钮",
        html`<div class="blora-speed-dial">
          ${trig(plus)}<button
            class="blora-button blora-speed-dial__close"
            data-size="icon"
            data-variant="danger"
            type="button"
            aria-label="关闭"
          >
            ${unsafeHTML(close)}
          </button>
          <div class="blora-speed-dial__actions">
            ${labeledAct(edit, "编辑")}${labeledAct(copy, "复制")}${labeledAct(del, "删除")}
          </div>
        </div>`,
      )}
      ${stage(
        "标签 · 主操作",
        html`<div class="blora-speed-dial">
          ${trig(plus)}<button
            class="blora-button blora-speed-dial__main"
            data-size="icon"
            data-variant="secondary"
            type="button"
            aria-label="发布"
          >
            ${unsafeHTML(send)}
          </button>
          <div class="blora-speed-dial__actions">
            ${labeledAct(doc, "草稿")}${labeledAct(copy, "定时")}${labeledAct(gallery, "预览")}
          </div>
        </div>`,
      )}
      ${stage(
        "水平 · 向左",
        html`<div class="blora-speed-dial blora-speed-dial--left">
          ${trig(plus)}
          <div class="blora-speed-dial__actions">
            ${act(msg, "消息")}${act(mail, "邮件")}${act(phone, "通话")}
          </div>
        </div>`,
      )}
      ${stage(
        "花瓣 · 主操作",
        html`<div class="blora-speed-dial blora-speed-dial--flower">
          ${trig(plus)}<button
            class="blora-button blora-speed-dial__main"
            data-size="icon"
            data-variant="secondary"
            type="button"
            aria-label="写文章"
          >
            ${unsafeHTML(edit)}
          </button>
          <div class="blora-speed-dial__actions">
            ${act(camera, "拍照")}${act(vote, "投票")}${act(gallery, "图库")}${act(mic, "语音")}
          </div>
        </div>`,
      )}
      ${stage(
        "花瓣 · 纯展开",
        html`<div class="blora-speed-dial blora-speed-dial--flower">
          ${trig(plus)}
          <div class="blora-speed-dial__actions">
            ${act(home, "首页")}${act(search, "搜索")}${act(star, "收藏")}${act(settings, "设置")}
          </div>
        </div>`,
      )}
    </div>
  `,
};
