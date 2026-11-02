/** Small server-safe Markdown renderer: escape HTML and emit only known tags. */
function escapeHtml(value: string): string {
 return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function inline(value: string): string {
 return value.split(/(\[[^\]\n]+\]\([^\s)]+\))/g).map((part) => {
  const link = part.match(/^\[([^\]\n]+)\]\(([^\s)]+)\)$/);
  if (link) {
   const [, label, href] = link;
   const safe = !/[\\\u0000-\u0020]/.test(href) && (
    (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#") || /^https?:\/\//i.test(href)
   );
   return safe ? `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>` : escapeHtml(label);
  }
  return escapeHtml(part).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
 }).join("");
}

export function renderBlogBody(markdown: string): string {
 const lines = (markdown || "").replace(/\r\n?/g, "\n").split("\n");
 const blocks: string[] = [];
 let paragraph: string[] = [];
 let list: string[] = [];
 let listType = "ul";
 const flushParagraph = () => {
  if (paragraph.length) blocks.push(`<p>${inline(paragraph.join("\n"))}</p>`);
  paragraph = [];
 };
 const flushList = () => {
  if (list.length) blocks.push(`<${listType}>${list.map(item => `<li>${inline(item)}</li>`).join("")}</${listType}>`);
  list = [];
 };
 for (const line of lines) {
  const heading = line.match(/^(#{2,3})\s+(.+)$/);
  const bullet = line.match(/^\s*(?:([-*])|\d+\.)\s+(.+)$/);
  if (!line.trim()) { flushParagraph(); flushList(); }
  else if (heading) {
   flushParagraph(); flushList();
   blocks.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
  } else if (bullet) {
   flushParagraph();
   const type = bullet[1] ? "ul" : "ol";
   if (listType !== type) flushList();
   listType = type;
   list.push(bullet[2]);
  } else { flushList(); paragraph.push(line); }
 }
 flushParagraph(); flushList();
 return blocks.join("\n");
}
