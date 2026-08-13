# Media Container migration

Replace v1 \`.blora-media-frame\` with \`.blora-media\` and declare the supported ratio:

\`\`\`html
<figure class="blora-media" data-ratio="video">
  <img src="cover.jpg" alt="视频封面">
</figure>
\`\`\`

Use \`data-fit="contain"\` when media must remain fully visible rather than cropped.
