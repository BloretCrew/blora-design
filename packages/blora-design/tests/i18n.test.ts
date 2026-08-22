import { describe, it, expect, afterEach } from "vitest";
import { applyDocumentLocale, getLocale, setLocale, t } from "../src/core/i18n.js";
import { BloraElement } from "../src/core/blora-element.js";
import { en } from "../src/locales/en.js";
import { zhCN } from "../src/locales/zh-CN.js";

describe("i18n", () => {
  afterEach(() => {
    document.documentElement.lang = "zh-CN";
    applyDocumentLocale();
  });

  it("serves chrome strings from the active catalog", () => {
    setLocale("en", en);
    expect(t("common.close")).toBe("Close");
    setLocale("zh-CN", zhCN);
    expect(t("common.close")).toBe("关闭");
  });

  it("interpolates named placeholders", () => {
    setLocale("en");
    expect(t("tour.step", { current: 2, total: 5 })).toBe("2 / 5");
    expect(t("pagination.page", { n: 3 })).toBe("Page 3");
    setLocale("zh-CN", zhCN);
    expect(t("pagination.page", { n: 3 })).toBe("第 3 页");
  });

  it("follows document.documentElement.lang", () => {
    document.documentElement.lang = "en-US";
    applyDocumentLocale();
    expect(getLocale()).toBe("en");
    expect(t("tour.start")).toBe("Start tour");
  });

  it("re-renders mounted chrome when the locale changes", () => {
    class LocaleProbe extends BloraElement {
      private root: HTMLElement | null = null;
      protected render(): void {
        this.root = this.ownerDocument.createElement("div");
        this.root.className = "probe";
        this.replaceChildren(this.root);
      }
      protected override sync(): void {
        this.root!.textContent = t("common.close");
      }
      protected bindEvents(): void {}
      override connectedCallback(): void {
        super.connectedCallback();
        this.sync();
      }
    }
    const TAG = "blora-locale-probe";
    if (!customElements.get(TAG)) customElements.define(TAG, LocaleProbe);

    function make(): Element {
      const el = document.createElement(TAG);
      document.body.append(el);
      return el;
    }

    setLocale("en", en);
    const el = make();
    expect(el.textContent).toBe("Close");

    setLocale("zh-CN", zhCN);
    expect(el.textContent).toBe("关闭");

    setLocale("en", en);
    expect(el.textContent).toBe("Close");
    el.remove();
  });

  it("keeps en and zh-CN catalogs on the same keys", () => {
    const enKeys = Object.keys(en.messages).sort();
    const zhKeys = Object.keys(zhCN.messages).sort();
    expect(zhKeys).toEqual(enKeys);
  });
});
