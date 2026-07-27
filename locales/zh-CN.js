/**
 * Blora Design · zh-CN locale pack
 * 用法：
 *   // npm / bundler
 *   const zh = require("@bloret/blora-design/locales/zh-CN");
 *   Blora.setLocale("zh-CN", zh);
 *   // 或 CDN：在 blora.js 之后加载本文件，会自动注册到 Blora
 */
(function (root, factory) {
  const pack = factory();
  if (typeof module === "object" && module.exports) module.exports = pack;
  if (root) {
    root.BloraLocales = root.BloraLocales || {};
    root.BloraLocales["zh-CN"] = pack;
    if (root.Blora && typeof root.Blora.setLocale === "function") {
      /* 不自动切换，仅注册；需要时 Blora.setLocale("zh-CN", BloraLocales["zh-CN"]) */
    }
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
    collator: "zh-CN",
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    dow: ["日", "一", "二", "三", "四", "五", "六"],
    year: "年",
    today: "今日",
    clear: "清除",
    now: "现在",
    confirm: "确定",
    hour: "时",
    minute: "分",
    messages: {
      "validate.required": "此项为必填",
      "validate.email": "请输入有效的邮箱地址",
      "validate.url": "请输入有效的网址",
      "validate.number": "请输入有效数字",
      "validate.min": "不能小于 {n}",
      "validate.max": "不能大于 {n}",
      "validate.minlength": "至少输入 {n} 个字符",
      "validate.maxlength": "最多输入 {n} 个字符",
      "validate.pattern": "格式不正确",
      "validate.mismatch": "输入不匹配",
      "validate.async": "校验未通过",
      "pagination.prev": "上一页",
      "pagination.next": "下一页",
      "pagination.page": "第 {n} 页",
      "pagination.nav": "分页",
      "cascader.selectedPrefix": "已选：",
      "common.close": "关闭",
      "common.cancel": "取消",
      "common.ok": "确定",
      "common.next": "下一步",
      "common.prev": "上一步",
      "common.skip": "跳过",
      "common.done": "完成",
      "common.copy": "复制",
      "common.copied": "已复制",
      "common.backTop": "回到顶部",
      "common.min": "最小值",
      "common.max": "最大值",
      "table.empty": "暂无数据",
      "table.loading": "加载中…",
      "table.selectAll": "全选",
      "table.selectRow": "选择行",
      "table.selected": "已选 {n} 项",
      "table.clearSelection": "取消选择",
      "table.bulk": "批量操作",
      "table.cols": "列设置",
      "table.colsReset": "重置列",
      "table.colDrag": "拖动排序",
      "select.search": "搜索…",
      "select.empty": "无匹配选项",
      "select.placeholder": "请选择",
      "select.more": "+{n}",
      "palette.title": "配色",
      "palette.hint": "仅替换语义颜色，不改变组件形态",
      "palette.label": "配色",
      "colorMode.system": "跟随系统",
      "colorMode.light": "浅色",
      "colorMode.dark": "深色",
      "colorMode.switch": "当前{current}，切换至{next}",
      "upload.remove": "移除",
      "upload.drop": "拖拽文件至此",
      "upload.or": "或",
      "upload.browse": "点击选择",
      "file.clear": "移除已选文件",
      "preview.prev": "上一张",
      "preview.next": "下一张",
      "preview.close": "关闭预览",
      "tour.step": "{current} / {total}",
      "autocomplete.empty": "无匹配项",
      "color.swatch": "选择颜色，当前 {color}",
      "color.panel": "选择颜色",
      "color.hue": "色相",
      "color.spectrum": "颜色饱和度与明度",
      "color.hex": "十六进制颜色",
    },
  };
}));
