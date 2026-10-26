import { parseDocument } from 'htmlparser2';

type HtmlNode = ReturnType<typeof parseDocument>['children'][number];

/** Convert existing editor HTML identically in browsers and DOM-free SSR. */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  if (!/<[a-z][\s\S]*>/i.test(html)) return html;

  function parseNode(node: HtmlNode): string {
    if (node.type === 'text') return node.data;
    if (!('name' in node) || !('attribs' in node)) return '';
    const childrenText = node.children.map(parseNode).join('');
    switch (node.name.toLowerCase()) {
      case 'h1':
        return `# ${childrenText.trim()}\n\n`;
      case 'h2':
        return `## ${childrenText.trim()}\n\n`;
      case 'h3':
        return `### ${childrenText.trim()}\n\n`;
      case 'p':
        return childrenText.trim() ? `${childrenText.trim()}\n\n` : '';
      case 'strong':
      case 'b':
        return childrenText.trim() ? `**${childrenText}**` : '';
      case 'em':
      case 'i':
        return childrenText.trim() ? `*${childrenText}*` : '';
      case 'u':
        return childrenText.trim() ? `<u>${childrenText}</u>` : '';
      case 's':
      case 'del':
      case 'strike':
        return childrenText.trim() ? `~~${childrenText}~~` : '';
      case 'blockquote':
        return `> ${childrenText.trim()}\n\n`;
      case 'ul':
        return `${node.children
          .filter((child) => 'name' in child && 'attribs' in child)
          .map((li) => `- ${parseNode(li).trim()}`)
          .join('\n')}\n\n`;
      case 'ol':
        return `${node.children
          .filter((child) => 'name' in child && 'attribs' in child)
          .map((li, index) => `${index + 1}. ${parseNode(li).trim()}`)
          .join('\n')}\n\n`;
      case 'li':
        return childrenText;
      case 'a':
        return `[${childrenText}](${node.attribs.href || ''})`;
      case 'br':
        return '\n';
      default:
        return childrenText;
    }
  }
  return parseDocument(html).children.map(parseNode).join('').trim();
}
