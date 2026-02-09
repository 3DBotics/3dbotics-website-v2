/**
 * Simple markdown to HTML converter for LM Studio responses
 * Handles common markdown patterns like **bold**, *italic*, etc.
 */

export function renderMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert _italic_ to <em>
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Convert `code` to <code>
  html = html.replace(/`(.+?)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-cyan-400">$1</code>');
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Strip markdown formatting completely (for plain text display)
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  
  let plain = text;
  
  // Remove **bold**
  plain = plain.replace(/\*\*(.+?)\*\*/g, '$1');
  
  // Remove *italic*
  plain = plain.replace(/\*(.+?)\*/g, '$1');
  
  // Remove _italic_
  plain = plain.replace(/_(.+?)_/g, '$1');
  
  // Remove `code`
  plain = plain.replace(/`(.+?)`/g, '$1');
  
  return plain;
}
