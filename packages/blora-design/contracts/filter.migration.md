# Filter migration

Use a native form or fieldset with radio inputs. The reset control appears after a selection:

\`\`\`html
<form class="blora-filter" aria-label="状态筛选">
  <label class="blora-filter__item"><input type="radio" name="status"><span class="blora-filter__label">全部</span></label>
  <button class="blora-filter__reset" type="reset">清除</button>
</form>
\`\`\`
