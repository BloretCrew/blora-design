# Number Input migration

Replace the v1 numeric input wrapper and handwritten increment/decrement buttons with the official element:

\`\`\`html
<blora-number-input name="quantity" value="1" min="0" max="10" step="1" label="数量"></blora-number-input>
\`\`\`

The generated light DOM retains a native \`input[type="number"]\`; increment and decrement controls use Blora's Lucide icon factory.
