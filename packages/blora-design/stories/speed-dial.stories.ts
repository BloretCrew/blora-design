import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Actions/Speed Dial",
  component: "blora-speed-dial",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const action = (value: string, label: string, icon?: string, variant?: string) => html`
  <blora-speed-dial-action
    value=${value}
    label=${label}
    icon=${icon ?? "document"}
    variant=${variant ?? "secondary"}
  ></blora-speed-dial-action>
`;

const stage = (label: string, dial: unknown) => html`
  <div class="blora-speed-dial-stage">
    <p class="blora-speed-dial-stage__label">${label}</p>
    ${dial}
  </div>
`;

export const AllVariants: Story = {
  name: "V1 complete variants",
  render: () => html`
    <div class="blora-speed-dial-grid">
      ${stage(
        "垂直 · 图标",
        html`<blora-speed-dial label="新建" open>
          ${action("camera", "拍照", "camera")} ${action("gallery", "图库", "image")}
          ${action("voice", "语音", "mic")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "垂直 · 标签",
        html`<blora-speed-dial label="快捷操作" action-appearance="label" open>
          ${action("document", "新建文档", "document-add")}
          ${action("upload", "上传文件", "upload")} ${action("share", "分享", "share")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "垂直 · 矩形按钮",
        html`<blora-speed-dial label="项目操作" action-appearance="button" open>
          ${action("new-project", "新建项目")} ${action("import", "导入数据")}
          ${action("export", "导出报告")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "标签 · 关闭钮",
        html`<blora-speed-dial label="编辑操作" action-appearance="label" close-button open>
          ${action("edit", "编辑", "pencil")} ${action("copy", "复制", "copy")}
          ${action("delete", "删除", "trash", "danger")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "标签 · 主操作",
        html`<blora-speed-dial
          label="发布操作"
          action-appearance="label"
          main-label="发布"
          main-icon="arrow-up"
          open
        >
          ${action("draft", "草稿", "document")} ${action("schedule", "定时", "clock")}
          ${action("preview", "预览", "eye")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "水平 · 向左",
        html`<blora-speed-dial label="联系操作" mode="left" open>
          ${action("message", "消息", "message")} ${action("mail", "邮件", "mail")}
          ${action("phone", "电话", "phone")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "花瓣 · 主操作",
        html`<blora-speed-dial
          label="媒体操作"
          mode="flower"
          main-label="编辑"
          main-icon="pencil"
          open
        >
          ${action("camera", "拍照", "camera")} ${action("chart", "统计", "chart")}
          ${action("gallery", "图库", "image")} ${action("voice", "语音", "mic")}
        </blora-speed-dial>`,
      )}
      ${stage(
        "花瓣 · 纯展开",
        html`<blora-speed-dial label="快捷入口" mode="flower" open>
          ${action("home", "首页", "home")} ${action("search", "搜索", "search")}
          ${action("favorite", "收藏", "star")} ${action("theme", "主题", "sun")}
        </blora-speed-dial>`,
      )}
    </div>
  `,
};
