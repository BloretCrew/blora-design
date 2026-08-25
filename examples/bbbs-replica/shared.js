(() => {
  const Blora = window.Blora;
  if (!Blora) return;

  Blora.autoDefine();

  document.querySelectorAll("[data-icon]").forEach((host) => {
    const name = host.dataset.icon;
    if (!name || host.querySelector("svg")) return;
    host.replaceChildren(Blora.createBloraIcon(name, 18));
  });

  const search = document.getElementById("global-search");
  const feedItems = [...document.querySelectorAll("[data-feed-item]")];
  const empty = document.getElementById("feed-empty");
  let activeFilter = "all";

  const applyFeedState = () => {
    const query = String(search?.value || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    let visibleCount = 0;
    feedItems.forEach((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        String(item.dataset.filterTags || "")
          .split(" ")
          .includes(activeFilter);
      const matchesQuery =
        !query ||
        String(item.dataset.search || "")
          .toLocaleLowerCase("zh-CN")
          .includes(query);
      const visible = matchesFilter && matchesQuery;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (empty) empty.hidden = visibleCount > 0;
  };

  search?.addEventListener("input", applyFeedState);
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      document.querySelectorAll("[data-filter]").forEach((candidate) => {
        const selected = candidate === button;
        candidate.dataset.variant = selected ? "outline" : "ghost";
        candidate.setAttribute("aria-pressed", String(selected));
      });
      applyFeedState();
    });
  });

  const compose = document.getElementById("quick-compose-input");
  document.getElementById("compose-focus")?.addEventListener("click", () => {
    compose?.focus();
    compose?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.getElementById("quick-send")?.addEventListener("click", () => {
    const status = document.getElementById("quick-status");
    if (!compose?.value.trim()) {
      if (status) status.textContent = "请先输入要发布的内容。";
      compose?.focus();
      return;
    }
    compose.value = "";
    if (status) status.textContent = "演示内容已提交到 大厅 / 灌水区。";
  });

  const composer = document.getElementById("comment-composer");
  const commentInput = document.getElementById("comment-input");
  const preview = document.getElementById("comment-preview");

  const renderPreview = () => {
    if (!preview || !commentInput) return;
    const value = commentInput.value.trim();
    preview.textContent = value || "暂无内容。返回编辑标签开始撰写。";
    preview.classList.toggle("is-placeholder", !value);
  };

  composer?.addEventListener("blora-thread-tab-change", (event) => {
    if (event.detail?.tab === "preview" || composer.tab === "preview") renderPreview();
  });

  document.querySelectorAll("[data-insert]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!commentInput) return;
      composer?.setTab("edit");
      const [prefix, suffix = ""] = String(button.dataset.insert).split("|");
      const start = commentInput.selectionStart ?? commentInput.value.length;
      const end = commentInput.selectionEnd ?? start;
      const selected = commentInput.value.slice(start, end);
      commentInput.setRangeText(`${prefix}${selected}${suffix}`, start, end, "end");
      commentInput.focus();
    });
  });

  document.getElementById("comment-submit")?.addEventListener("click", () => {
    const status = document.getElementById("composer-status");
    if (!commentInput?.value.trim()) {
      if (status) status.textContent = "评论内容不能为空。";
      composer?.setTab("edit");
      commentInput?.focus();
      return;
    }
    commentInput.value = "";
    renderPreview();
    composer?.setTab("edit");
    if (status) status.textContent = "评论已作为静态演示提交。";
  });

  const commentToggle = document.getElementById("collapse-comments");
  const collapsibleComments = () =>
    [...document.querySelectorAll("blora-thread-comment")].filter((comment) => comment.collapsible);
  const syncCommentToggle = () => {
    if (!commentToggle) return;
    const comments = collapsibleComments();
    const hasCollapsed = comments.some((comment) => comment.collapsed);
    commentToggle.lastChild.textContent = hasCollapsed ? " 展开长评论" : " 折叠长评论";
    commentToggle.disabled = comments.length === 0;
  };

  commentToggle?.addEventListener("click", () => {
    const comments = collapsibleComments();
    const shouldExpand = comments.some((comment) => comment.collapsed);
    comments.forEach((comment) => {
      if (shouldExpand) comment.expand();
      else comment.collapse();
    });
    syncCommentToggle();
  });

  if (commentToggle) {
    commentToggle.disabled = true;
    const commentObserver = new MutationObserver(syncCommentToggle);
    document.querySelectorAll("blora-thread-comment").forEach((comment) => {
      commentObserver.observe(comment, {
        attributes: true,
        attributeFilter: ["data-blora-ready", "data-collapsible", "data-collapsed"],
      });
    });
    requestAnimationFrame(syncCommentToggle);
  }
})();
