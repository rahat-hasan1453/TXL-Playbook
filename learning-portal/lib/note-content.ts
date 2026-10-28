// Notes are stored as HTML from the rich text editor. Notes written before the
// editor existed are plain text, so every reader goes through these helpers.

export function isRichNote(content: string): boolean {
  return /^\s*</.test(content)
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

/** HTML the editor can load, converting legacy plain-text notes paragraph by paragraph. */
export function noteToHtml(content: string): string {
  if (!content) return ""
  if (isRichNote(content)) return content
  return content
    .split(/\n/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("")
}

/** Readable plain text for previews, share drafts and anywhere HTML is not rendered. */
export function noteToPlainText(content: string): string {
  if (!content) return ""
  if (!isRichNote(content)) return content
  return content
    .replace(/<img[^>]*>/gi, " [image] ")
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|blockquote|pre|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/** True when the editor holds nothing worth saving (just empty paragraphs). */
export function isNoteEmpty(content: string): boolean {
  if (!content) return true
  if (/<(img|hr)\b/i.test(content)) return false
  return noteToPlainText(content).trim() === ""
}
