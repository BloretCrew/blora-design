import { describe, it, expect, afterEach } from "vitest";
import { applyDocumentLocale, getLocale, setLocale, t } from "../src/core/i18n.js";
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

  it("notifies mounted custom elements when the locale changes", async () => {
    const { defineBloraEmpty, BLORA_EMPTY_TAG } = await import("../src/components/empty/empty.js");
    defineBloraEmpty();
    setLocale("en", en);
    const el = document.createElement(BLORA_EMPTY_TAG);
    document.body.append(el);
    expect(el.querySelector(".blora-empty__title")?.textContent).toBe("No data");
    setLocale("zh-CN", zhCN);
    expect(el.querySelector(".blora-empty__title")?.textContent).toBe("暂无数据");
    el.remove();
  });

  it("keeps en and zh-CN catalogs on the same keys", () => {
    const enKeys = Object.keys(en.messages).sort();
    const zhKeys = Object.keys(zhCN.messages).sort();
    expect(zhKeys).toEqual(enKeys);
  });
});
