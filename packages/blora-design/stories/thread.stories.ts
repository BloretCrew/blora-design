import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
// Addon is not in the core package — import from workspace source for Storybook.
import { createThreadController } from "../../../addons/thread/src/index";
import "../../../addons/thread/src/thread.css";

const meta = {
  title: "Add-ons/Thread",
  component: ".blora-thread",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "论坛跟帖 Thread/Post（`@bloret-crew/blora-design-thread`）。不进核心包；CSS + `createThreadController` 1:1 对齐 v1 `initThread`。",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

type ThreadHost = HTMLElement & { __threadCtrl?: { destroy(): void } };

const bindThread = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  const host = el as ThreadHost;
  host.__threadCtrl?.destroy();
  host.__threadCtrl = createThreadController(host);
};

export const ForumThread: Story = {
  name: "Forum thread",
  render: () => html`
    <div class="blora-thread" data-blora-thread ${ref(bindThread)}>
      <article class="blora-post">
        <header class="blora-post__head">
          <div class="blora-post__identity">
            <span class="blora-avatar" data-size="lg" data-variant="primary">D</span>
            <div class="blora-post__who">
              <div class="blora-post__author-row">
                <a class="blora-post__author" href="#thread-demo">diddy123</a>
              </div>
              <div class="blora-post__sub">
                评论于 <time datetime="2026-07-17">10 天前</time> ·
                <span class="blora-post__loc">江苏</span>
              </div>
            </div>
          </div>
          <div class="blora-post__tools">
            <button type="button">链接</button>
            <button type="button">回复</button>
            <button type="button" class="is-danger">删除</button>
            <button type="button">编辑</button>
            <button type="button" class="blora-post__more" aria-label="更多">···</button>
          </div>
        </header>
        <div class="blora-post__title">妈妈</div>
        <div class="blora-post__react">
          <button
            type="button"
            class="blora-post__react-btn"
            data-blora-post-react
            aria-label="添加表情"
            title="表情"
            aria-pressed="false"
          >
            ☺
          </button>
        </div>

        <div class="blora-post__replies" data-blora-thread-replies>
          <div class="blora-post__replies-body" data-blora-thread-body>
            <article class="blora-post blora-post--reply">
              <header class="blora-post__head">
                <div class="blora-post__identity">
                  <span class="blora-avatar" data-size="sm" data-variant="neutral">De</span>
                  <div class="blora-post__who">
                    <div class="blora-post__author-row">
                      <a class="blora-post__author" href="#thread-demo">Detrital</a>
                      <span class="blora-post__badge">何意味</span>
                      <span class="blora-post__reply-to"
                        >回复 <a href="#thread-demo">@diddy123</a></span
                      >
                    </div>
                    <div class="blora-post__sub">
                      评论于 <time datetime="2026-07-17">10 天前</time> ·
                      <span class="blora-post__loc">浙江</span>
                    </div>
                  </div>
                </div>
                <div class="blora-post__tools">
                  <button type="button">链接</button>
                  <button type="button">回复</button>
                  <button type="button" class="is-danger">删除</button>
                  <button type="button">编辑</button>
                  <button type="button" class="blora-post__more" aria-label="更多">···</button>
                </div>
              </header>
              <div class="blora-post__quote">
                <span class="blora-post__quote-label">回复 @diddy123</span>
                <span class="blora-post__quote-text">妈妈</span>
              </div>
              <div class="blora-post__body">
                <p>
                  这个帖子仅以一个二级标题「妈妈」作为内容，没有正文。在论坛中，<strong>这种极简发帖通常是为了引发情感共鸣或作为一个开放话题，让网友围绕「母亲」展开讨论</strong>——比如分享与妈妈的暖心故事、求助与妈妈的矛盾、或者单纯表达思念。
                </p>
                <p>
                  在网络文化中，「妈妈」一词还有延伸用法：在饭圈（粉丝圈）里，「妈妈」常作为粉丝自称（「妈妈粉」），表示以母亲般的心态爱护偶像；在一些表情包或段子里，「妈妈」也会被用来撒娇或偷懒（如经典的「妈妈，饿饿，饭饭」）。
                </p>
                <p>
                  由于原帖缺乏正文，具体含义需要结合上下文才能确定，但可以推测这是一个与母亲相关的情感或闲聊帖。
                </p>
              </div>
              <div class="blora-post__react">
                <button
                  type="button"
                  class="blora-post__react-btn"
                  data-blora-post-react
                  aria-label="添加表情"
                  title="表情"
                  aria-pressed="false"
                >
                  ☺
                </button>
              </div>
            </article>

            <article class="blora-post blora-post--reply">
              <header class="blora-post__head">
                <div class="blora-post__identity">
                  <span class="blora-avatar" data-size="sm" data-variant="primary">De</span>
                  <div class="blora-post__who">
                    <div class="blora-post__author-row">
                      <a class="blora-post__author" href="#thread-demo">Detrital</a>
                      <span class="blora-post__badge">何意味</span>
                      <span class="blora-post__reply-to"
                        >回复 <a href="#thread-demo">@Detrital</a></span
                      >
                    </div>
                    <div class="blora-post__sub">
                      评论于 <time datetime="2026-07-17">10 天前</time> ·
                      <span class="blora-post__loc">浙江</span>
                    </div>
                  </div>
                </div>
                <div class="blora-post__tools">
                  <button type="button">链接</button>
                  <button type="button">回复</button>
                  <button type="button" class="is-danger">删除</button>
                  <button type="button">编辑</button>
                  <button type="button" class="blora-post__more" aria-label="更多">···</button>
                </div>
              </header>
              <div class="blora-post__body">
                <p>补充一句：极简标题帖在社区里往往靠跟帖把话题撑起来，楼主不一定会回来解释。</p>
                <ul>
                  <li>适合闲聊 / 情感共鸣</li>
                  <li>需要结合上下文理解</li>
                </ul>
              </div>
              <div class="blora-post__react">
                <button
                  type="button"
                  class="blora-post__react-btn"
                  data-blora-post-react
                  aria-label="添加表情"
                  title="表情"
                  aria-pressed="false"
                >
                  ☺
                </button>
              </div>
            </article>
          </div>
          <button
            type="button"
            class="blora-post__collapse"
            data-blora-thread-toggle
            aria-expanded="true"
            data-label-collapse="收起评论"
            data-label-expand="展开评论"
          >
            收起评论
          </button>
        </div>
      </article>
    </div>
  `,
};

export const CollapsedByDefault: Story = {
  name: "Collapsed by default",
  render: () => html`
    <div class="blora-thread" data-blora-thread ${ref(bindThread)}>
      <article class="blora-post">
        <header class="blora-post__head">
          <div class="blora-post__identity">
            <span class="blora-avatar" data-size="lg" data-variant="info">A</span>
            <div class="blora-post__who">
              <div class="blora-post__author-row">
                <a class="blora-post__author" href="#c">alice</a>
              </div>
              <div class="blora-post__sub">评论于 <time>刚刚</time></div>
            </div>
          </div>
          <div class="blora-post__tools">
            <button type="button">回复</button>
          </div>
        </header>
        <div class="blora-post__title">收起态示例</div>
        <div class="blora-post__body"><p>主帖内容。下方跟帖默认折叠。</p></div>
        <div class="blora-post__replies is-collapsed" data-blora-thread-replies>
          <div class="blora-post__replies-body" data-blora-thread-body>
            <article class="blora-post blora-post--reply">
              <div class="blora-post__body"><p>第一条跟帖</p></div>
            </article>
            <article class="blora-post blora-post--reply">
              <div class="blora-post__body"><p>第二条跟帖</p></div>
            </article>
          </div>
          <button
            type="button"
            class="blora-post__collapse"
            data-blora-thread-toggle
            aria-expanded="false"
            data-label-collapse="收起评论"
            data-label-expand="展开评论"
          >
            展开评论
          </button>
        </div>
      </article>
    </div>
  `,
};

export const QuoteOnly: Story = {
  name: "Quote bar",
  render: () => html`
    <div class="blora-thread" style="max-width: 36rem">
      <article class="blora-post blora-post--reply">
        <div class="blora-post__quote">
          <span class="blora-post__quote-label">回复 @someone</span>
          <span class="blora-post__quote-text">被引用的原文摘要…</span>
        </div>
        <div class="blora-post__body">
          <p>
            跟帖正文。引用条是 thread 包的一部分（<code>.blora-post__quote</code>），不是
            foundations 的 blockquote。
          </p>
        </div>
      </article>
    </div>
  `,
};
