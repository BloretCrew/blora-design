# Sidebar Navigation migration

Sidebar Navigation formalizes the grouped links that 1.x pages assembled manually inside a sidebar.

```html
<blora-sidebar-nav label="Components" value="accordion">
  <blora-sidebar-nav-group label="Data display">
    <blora-sidebar-nav-link
      label="Accordion"
      href="#accordion"
      value="accordion"
    ></blora-sidebar-nav-link>
  </blora-sidebar-nav-group>
</blora-sidebar-nav>
```

Use the root `value` attribute or `select(value)` method to control the current page. Listen for
`blora-change` when the user activates a generated native link. Do not combine sidebar navigation
with `.blora-navbar__link` or `.blora-anchor__link`; those components have different semantics and
state rules.
