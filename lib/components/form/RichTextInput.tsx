'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

// ─── Markdown Utilities ───────────────────────────────────────────────────────

/**
 * Converts HTML content to clean, standard Markdown text.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || typeof document === 'undefined') return html || '';

  // If input doesn't contain HTML tags, return as-is
  if (!/<[a-z][\s\S]*>/i.test(html)) return html;

  const div = document.createElement('div');
  div.innerHTML = html;

  function parseNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const childrenText = Array.from(el.childNodes).map(parseNode).join('');

    switch (tag) {
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
        return `${Array.from(el.children)
          .map((li) => `- ${parseNode(li).trim()}`)
          .join('\n')}\n\n`;
      case 'ol':
        return `${Array.from(el.children)
          .map((li, idx) => `${idx + 1}. ${parseNode(li).trim()}`)
          .join('\n')}\n\n`;
      case 'li':
        return childrenText;
      case 'a': {
        const href = el.getAttribute('href') || '';
        return `[${childrenText}](${href})`;
      }
      case 'br':
        return '\n';
      default:
        return childrenText;
    }
  }

  return parseNode(div).trim();
}

/**
 * Converts standard Markdown text to HTML.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '<p></p>';

  // If input already looks like HTML, return as-is
  if (/<[a-z][\s\S]*>/i.test(markdown.trim())) {
    return markdown;
  }

  const lines = markdown.split('\n');
  const result: string[] = [];
  let inUl = false;
  let inOl = false;

  const processInline = (str: string): string => {
    return str
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<s>$1</s>')
      .replace(/<u>([^<]+)<\/u>/g, '<u>$1</u>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      continue;
    }

    if (line.startsWith('# ')) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(`<h1>${processInline(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(`<h2>${processInline(line.slice(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(`<h3>${processInline(line.slice(4))}</h3>`);
    } else if (line.startsWith('> ')) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(`<blockquote>${processInline(line.slice(2))}</blockquote>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        result.push('<ul>');
        inUl = true;
      }
      result.push(`<li>${processInline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        result.push('<ol>');
        inOl = true;
      }
      result.push(`<li>${processInline(line.replace(/^\d+\.\s/, ''))}</li>`);
    } else {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(`<p>${processInline(line)}</p>`);
    }
  }

  if (inUl) result.push('</ul>');
  if (inOl) result.push('</ol>');

  return result.join('');
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ToolbarOptions {
  /** Show Bold button (default: true) */
  bold?: boolean;
  /** Show Italic button (default: true) */
  italic?: boolean;
  /** Show Underline button (default: true) */
  underline?: boolean;
  /** Show Strikethrough button (default: true) */
  strikethrough?: boolean;
  /** Show Headings dropdown (default: true) */
  headings?: boolean;
  /** Show Bullet List button (default: true) */
  bulletList?: boolean;
  /** Show Ordered List button (default: true) */
  orderedList?: boolean;
  /** Show Blockquote button (default: true) */
  quote?: boolean;
  /** Show Link button (default: true) */
  link?: boolean;
  /** Show Text Align controls (default: true) */
  textAlign?: boolean;
  /** Show Clear Formatting button (default: true) */
  clearFormat?: boolean;
}

export type RichTextInputMode = 'wysiwyg' | 'markdown';
export type RichTextInputFormat = 'html' | 'markdown';

export interface RichTextInputProps {
  /** Content string (HTML or Markdown depending on outputFormat) */
  value?: string;
  /** Default content string (uncontrolled) */
  defaultValue?: string;
  /** Callback on content change — receives formatted string according to outputFormat */
  onChange?: (value: string) => void;
  /** Explicit callback receiving Markdown formatted string */
  onMarkdownChange?: (markdown: string) => void;
  /** Explicit callback receiving HTML formatted string */
  onHtmlChange?: (html: string) => void;
  /** Output format passed to onChange ('html' | 'markdown', default: 'html') */
  outputFormat?: RichTextInputFormat;
  /** Initial editor composition mode ('wysiwyg' | 'markdown', default: 'wysiwyg') */
  defaultMode?: RichTextInputMode;
  /** Controlled editor mode ('wysiwyg' | 'markdown') */
  mode?: RichTextInputMode;
  /** Callback when editor mode toggles */
  onModeChange?: (mode: RichTextInputMode) => void;
  /** Show the mode toggle switch in the toolbar (default: true) */
  showModeToggle?: boolean;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Label above the editor */
  label?: string;
  /** Helper text below the editor */
  helperText?: string;
  /** Error message displayed when invalid */
  errorMessage?: string;
  /** Show error/invalid state */
  isInvalid?: boolean;
  /** Disabled state (no editing) */
  disabled?: boolean;
  /** Brand color scheme */
  colorScheme?: 'blue' | 'purple';
  /** Min height of the editor body */
  minHeight?: string;
  /** Max height of the editor body — editor scrolls when content exceeds this */
  maxHeight?: string;
  /** Maximum character count allowed */
  maxLength?: number;
  /** Show character counter in footer */
  showCharCount?: boolean;
  /** Customize visible toolbar controls */
  toolbarOptions?: ToolbarOptions;
  /** Additional CSS class on the wrapper */
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  blue: { base: '#0685FF', ring: 'rgba(6, 133, 255, 0.18)', hover: '#057AE8' },
  purple: { base: '#7700CC', ring: 'rgba(119, 0, 204, 0.18)', hover: '#6600B3' },
} as const;

// ─── CSS Injected Globally Once ───────────────────────────────────────────────

let rteCssInjected = false;
function injectRteCss() {
  if (rteCssInjected || typeof document === 'undefined') return;
  rteCssInjected = true;
  const style = document.createElement('style');
  style.id = 'medix-rte-styles';
  style.textContent = `
    .medix-rte-content .tiptap {
      outline: none;
      padding: 12px 16px;
      min-height: inherit;
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--medix-form-text);
      caret-color: currentColor;
    }
    .medix-rte-content .tiptap p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: var(--medix-form-placeholder);
      pointer-events: none;
      float: left;
      height: 0;
    }
    .medix-rte-content .tiptap > * + * { margin-top: 0.6em; }
    .medix-rte-content .tiptap p { margin: 0; line-height: 1.65; }
    .medix-rte-content .tiptap h1 { font-size: 1.5em; font-weight: 700; line-height: 1.3; margin: 0; }
    .medix-rte-content .tiptap h2 { font-size: 1.25em; font-weight: 700; line-height: 1.35; margin: 0; }
    .medix-rte-content .tiptap h3 { font-size: 1.1em; font-weight: 600; line-height: 1.4; margin: 0; }
    .medix-rte-content .tiptap ul, .medix-rte-content .tiptap ol { padding-left: 1.4em; margin: 0; }
    .medix-rte-content .tiptap ul { list-style-type: disc; }
    .medix-rte-content .tiptap ol { list-style-type: decimal; }
    .medix-rte-content .tiptap li { margin: 0.2em 0; }
    .medix-rte-content .tiptap blockquote {
      border-left: 3px solid var(--medix-form-border);
      padding-left: 14px;
      color: var(--medix-form-text-muted, #6B7280);
      margin: 0;
      font-style: italic;
    }
    .medix-rte-content .tiptap a {
      color: #0685FF;
      text-decoration: underline;
      cursor: pointer;
    }
    .medix-rte-content .tiptap a:hover { color: #057AE8; }
    .medix-rte-content .tiptap strong { font-weight: 700; }
    .medix-rte-content .tiptap em { font-style: italic; }
    .medix-rte-content .tiptap u { text-decoration: underline; }
    .medix-rte-content .tiptap s { text-decoration: line-through; }
    .medix-rte-content .tiptap .text-left { text-align: left; }
    .medix-rte-content .tiptap .text-center { text-align: center; }
    .medix-rte-content .tiptap .text-right { text-align: right; }
    .medix-rte-content .tiptap .text-justify { text-align: justify; }
  `;
  document.head.appendChild(style);
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────

interface ToolbarBtnProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

function ToolbarBtn({
  onClick,
  isActive,
  disabled,
  title,
  accentColor,
  children,
}: ToolbarBtnProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '28px',
        padding: '0 8px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isActive
          ? accentColor
          : hovered
            ? 'var(--medix-form-bg-subtle, #F0F4F8)'
            : 'transparent',
        color: isActive ? '#fff' : 'var(--medix-form-text)',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.12s ease, color 0.12s ease',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ─── Toolbar Separator ────────────────────────────────────────────────────────

function ToolbarSep() {
  return (
    <div
      style={{
        width: '1px',
        height: '18px',
        background: 'var(--medix-form-border)',
        flexShrink: 0,
        alignSelf: 'center',
        margin: '0 2px',
      }}
    />
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconBold = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const IconItalic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
);

const IconUnderline = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);

const IconStrike = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
  </svg>
);

const IconBulletList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
  </svg>
);

const IconOrderedList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
  </svg>
);

const IconQuote = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
);

const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

const IconClearFormat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.97L17.73 21 19 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z" />
  </svg>
);

const IconAlignLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
  </svg>
);

const IconAlignCenter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
  </svg>
);

const IconAlignRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
  </svg>
);

// ─── Headings Select ──────────────────────────────────────────────────────────

interface HeadingSelectProps {
  editor: ReturnType<typeof useEditor>;
  accentColor: string;
  disabled?: boolean;
}

function HeadingSelect({ editor, accentColor, disabled }: HeadingSelectProps) {
  if (!editor) return null;

  const current = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'p';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const val = e.target.value;
    if (val === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(val.replace('h', ''), 10) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={disabled}
      onMouseDown={(e) => e.stopPropagation()}
      title="Text style"
      style={{
        height: '28px',
        padding: '0 6px',
        borderRadius: '6px',
        border: '1px solid var(--medix-form-border)',
        background: 'var(--medix-form-bg)',
        color: 'var(--medix-form-text)',
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        flexShrink: 0,
      }}
    >
      <option value="p">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
  );
}

// ─── Mode Switcher Pill Control ───────────────────────────────────────────────

function ModeSwitcher({
  currentMode,
  onSelectMode,
  accentColor,
  disabled,
}: {
  currentMode: RichTextInputMode;
  onSelectMode: (mode: RichTextInputMode) => void;
  accentColor: string;
  disabled?: boolean;
}) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      p="0.5"
      borderRadius="md"
      bg="bg.subtle"
      style={{
        background: 'var(--medix-form-bg-subtle, #F0F4F8)',
        border: '1px solid var(--medix-form-border)',
      }}
      ml="auto"
      flexShrink={0}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectMode('wysiwyg')}
        style={{
          padding: '2px 10px',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          borderRadius: '4px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: currentMode === 'wysiwyg' ? accentColor : 'transparent',
          color: currentMode === 'wysiwyg' ? '#ffffff' : 'var(--medix-form-text)',
          transition: 'all 0.15s ease',
        }}
      >
        Rich Text
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectMode('markdown')}
        style={{
          padding: '2px 10px',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          borderRadius: '4px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: currentMode === 'markdown' ? accentColor : 'transparent',
          color: currentMode === 'markdown' ? '#ffffff' : 'var(--medix-form-text)',
          transition: 'all 0.15s ease',
        }}
      >
        Markdown
      </button>
    </Box>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
  accentColor: string;
  disabled?: boolean;
  opts: Required<ToolbarOptions>;
  mode: RichTextInputMode;
  showModeToggle: boolean;
  onModeChange: (mode: RichTextInputMode) => void;
  onInsertMarkdown?: (snippet: string) => void;
}

function Toolbar({
  editor,
  accentColor,
  disabled,
  opts,
  mode,
  showModeToggle,
  onModeChange,
  onInsertMarkdown,
}: ToolbarProps) {
  const handleLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap="1"
      px="2"
      py="1.5"
      borderBottom="1px solid"
      borderColor="border"
      bg="bg.surface"
      style={{ background: 'var(--medix-form-bg)', borderBottomColor: 'var(--medix-form-border)' }}
    >
      <Box display="flex" alignItems="center" flexWrap="wrap" gap="0.5">
        {mode === 'wysiwyg' && editor ? (
          <>
            {opts.headings && (
              <>
                <HeadingSelect editor={editor} accentColor={accentColor} disabled={disabled} />
                <ToolbarSep />
              </>
            )}

            {opts.bold && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                disabled={disabled}
                title="Bold (Ctrl+B)"
                accentColor={accentColor}
              >
                <IconBold />
              </ToolbarBtn>
            )}
            {opts.italic && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                disabled={disabled}
                title="Italic (Ctrl+I)"
                accentColor={accentColor}
              >
                <IconItalic />
              </ToolbarBtn>
            )}
            {opts.underline && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                disabled={disabled}
                title="Underline (Ctrl+U)"
                accentColor={accentColor}
              >
                <IconUnderline />
              </ToolbarBtn>
            )}
            {opts.strikethrough && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                disabled={disabled}
                title="Strikethrough"
                accentColor={accentColor}
              >
                <IconStrike />
              </ToolbarBtn>
            )}

            {(opts.bulletList || opts.orderedList || opts.quote) && <ToolbarSep />}

            {opts.bulletList && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                disabled={disabled}
                title="Bullet List"
                accentColor={accentColor}
              >
                <IconBulletList />
              </ToolbarBtn>
            )}
            {opts.orderedList && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                disabled={disabled}
                title="Ordered List"
                accentColor={accentColor}
              >
                <IconOrderedList />
              </ToolbarBtn>
            )}
            {opts.quote && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                disabled={disabled}
                title="Blockquote"
                accentColor={accentColor}
              >
                <IconQuote />
              </ToolbarBtn>
            )}

            {opts.textAlign && (
              <>
                <ToolbarSep />
                <ToolbarBtn
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  disabled={disabled}
                  title="Align Left"
                  accentColor={accentColor}
                >
                  <IconAlignLeft />
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  isActive={editor.isActive({ textAlign: 'center' })}
                  disabled={disabled}
                  title="Align Center"
                  accentColor={accentColor}
                >
                  <IconAlignCenter />
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  disabled={disabled}
                  title="Align Right"
                  accentColor={accentColor}
                >
                  <IconAlignRight />
                </ToolbarBtn>
              </>
            )}

            {(opts.link || opts.clearFormat) && <ToolbarSep />}

            {opts.link && (
              <ToolbarBtn
                onClick={handleLink}
                isActive={editor.isActive('link')}
                disabled={disabled}
                title="Insert / Edit Link"
                accentColor={accentColor}
              >
                <IconLink />
              </ToolbarBtn>
            )}
            {opts.clearFormat && (
              <ToolbarBtn
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                disabled={disabled}
                title="Clear Formatting"
                accentColor={accentColor}
              >
                <IconClearFormat />
              </ToolbarBtn>
            )}
          </>
        ) : (
          /* Markdown mode toolbar helpers */
          <Box display="flex" alignItems="center" gap="1">
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('**bold text**')}
              disabled={disabled}
              title="Markdown Bold"
              accentColor={accentColor}
            >
              **B**
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('*italic text*')}
              disabled={disabled}
              title="Markdown Italic"
              accentColor={accentColor}
            >
              *I*
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('\n# Heading 1\n')}
              disabled={disabled}
              title="Markdown H1"
              accentColor={accentColor}
            >
              # H1
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('\n## Heading 2\n')}
              disabled={disabled}
              title="Markdown H2"
              accentColor={accentColor}
            >
              ## H2
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('\n- List item\n')}
              disabled={disabled}
              title="Markdown Bullet List"
              accentColor={accentColor}
            >
              - List
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('[link text](https://example.com)')}
              disabled={disabled}
              title="Markdown Link"
              accentColor={accentColor}
            >
              [Link]
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onInsertMarkdown?.('\n> Blockquote\n')}
              disabled={disabled}
              title="Markdown Blockquote"
              accentColor={accentColor}
            >
              &gt; Quote
            </ToolbarBtn>
          </Box>
        )}
      </Box>

      {showModeToggle && (
        <ModeSwitcher
          currentMode={mode}
          onSelectMode={onModeChange}
          accentColor={accentColor}
          disabled={disabled}
        />
      )}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_TOOLBAR: Required<ToolbarOptions> = {
  bold: true,
  italic: true,
  underline: true,
  strikethrough: true,
  headings: true,
  bulletList: true,
  orderedList: true,
  quote: true,
  link: true,
  textAlign: true,
  clearFormat: true,
};

/**
 * MedixDeck RichTextInput
 *
 * A versatile editor supporting both Visual Rich Text (TipTap) and Standard Markdown modes.
 *
 * @example
 * ```tsx
 * // Default Rich Text mode with Mode Toggle
 * <RichTextInput value={content} onChange={setContent} />
 *
 * // Direct Markdown output mode for backend integration
 * <RichTextInput outputFormat="markdown" onChange={setMarkdown} />
 * ```
 */
export function RichTextInput({
  value,
  defaultValue,
  onChange,
  onMarkdownChange,
  onHtmlChange,
  outputFormat = 'html',
  defaultMode = 'wysiwyg',
  mode: controlledMode,
  onModeChange,
  showModeToggle = true,
  placeholder = 'Start typing...',
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  disabled = false,
  colorScheme = 'blue',
  minHeight = '180px',
  maxHeight = '400px',
  maxLength,
  showCharCount = false,
  toolbarOptions,
  className,
}: RichTextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalMode, setInternalMode] = React.useState<RichTextInputMode>(defaultMode);
  const activeMode = controlledMode !== undefined ? controlledMode : internalMode;

  const isControlled = value !== undefined;
  const accent = COLORS[colorScheme];
  const opts = { ...DEFAULT_TOOLBAR, ...toolbarOptions };

  // Raw Markdown text state when in Markdown mode
  const [markdownContent, setMarkdownContent] = React.useState<string>(() => {
    const initial = isControlled ? value : (defaultValue ?? '');
    return outputFormat === 'markdown' ? initial : htmlToMarkdown(initial);
  });

  const markdownTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    injectRteCss();
  }, []);

  // TipTap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: isControlled
      ? outputFormat === 'markdown'
        ? markdownToHtml(value ?? '')
        : (value ?? '')
      : defaultValue
        ? outputFormat === 'markdown'
          ? markdownToHtml(defaultValue)
          : defaultValue
        : '',
    editable: !disabled,
    editorProps: {
      attributes: {
        spellcheck: 'true' as string,
      },
    },
    onUpdate({ editor: e }) {
      const html = e.getHTML();
      const cleanHtml = html === '<p></p>' ? '' : html;
      const md = htmlToMarkdown(cleanHtml);

      onHtmlChange?.(cleanHtml);
      onMarkdownChange?.(md);

      const emitVal = outputFormat === 'markdown' ? md : cleanHtml;
      if (maxLength !== undefined && e.getText().length > maxLength) return;
      onChange?.(emitVal);
    },
    onFocus() {
      setIsFocused(true);
    },
    onBlur() {
      setIsFocused(false);
    },
  });

  // Mode switching handler
  const handleModeChange = (nextMode: RichTextInputMode) => {
    if (nextMode === activeMode) return;

    if (nextMode === 'markdown') {
      // Switching from WYSIWYG -> Markdown
      const currentHtml = editor ? editor.getHTML() : '';
      const md = htmlToMarkdown(currentHtml === '<p></p>' ? '' : currentHtml);
      setMarkdownContent(md);
    } else {
      // Switching from Markdown -> WYSIWYG
      const html = markdownToHtml(markdownContent);
      if (editor) {
        editor.commands.setContent(html, { emitUpdate: false });
      }
    }

    if (controlledMode === undefined) {
      setInternalMode(nextMode);
    }
    onModeChange?.(nextMode);
  };

  // Markdown raw textarea change handler
  const handleMarkdownTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const md = e.target.value;
    setMarkdownContent(md);

    const html = markdownToHtml(md);
    onMarkdownChange?.(md);
    onHtmlChange?.(html);

    const emitVal = outputFormat === 'markdown' ? md : html;
    if (maxLength !== undefined && md.length > maxLength) return;
    onChange?.(emitVal);

    // Sync HTML into tipTap editor seamlessly
    if (editor) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  };

  // Insert markdown snippet helper button handler
  const handleInsertMarkdownSnippet = (snippet: string) => {
    const textarea = markdownTextareaRef.current;
    if (!textarea) {
      setMarkdownContent((prev) => prev + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + snippet + text.substring(end);

    setMarkdownContent(newText);
    const html = markdownToHtml(newText);
    onMarkdownChange?.(newText);
    onHtmlChange?.(html);

    const emitVal = outputFormat === 'markdown' ? newText : html;
    onChange?.(emitVal);

    if (editor) {
      editor.commands.setContent(html, { emitUpdate: false });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  // Sync controlled value prop into editor & markdown content
  React.useEffect(() => {
    if (!isControlled) return;

    if (outputFormat === 'markdown') {
      const md = value ?? '';
      setMarkdownContent(md);
      if (editor) {
        const html = markdownToHtml(md);
        const currentHtml = editor.getHTML();
        if (currentHtml !== html) {
          editor.commands.setContent(html, { emitUpdate: false });
        }
      }
    } else {
      const htmlVal = value === '' ? '<p></p>' : (value ?? '<p></p>');
      if (editor) {
        const currentHtml = editor.getHTML();
        if (currentHtml !== htmlVal) {
          editor.commands.setContent(htmlVal, { emitUpdate: false });
        }
      }
      setMarkdownContent(htmlToMarkdown(value ?? ''));
    }
  }, [editor, isControlled, value, outputFormat]);

  const charCount =
    activeMode === 'markdown' ? markdownContent.length : (editor?.getText().length ?? 0);

  const borderColor = isInvalid ? '#DC2626' : isFocused ? accent.base : 'var(--medix-form-border)';

  return (
    <Box w="100%" className={className}>
      {label && (
        <Text
          mb="1.5"
          fontSize="sm"
          fontWeight="500"
          fontFamily="var(--font-body)"
          color="text.heading"
        >
          {label}
        </Text>
      )}

      <Box
        borderRadius="md"
        overflow="hidden"
        bg="bg.surface"
        opacity={disabled ? 0.6 : 1}
        style={{
          border: `1.5px solid ${borderColor}`,
          transition: 'border-color 0.15s ease',
          boxShadow: 'none',
          background: 'var(--medix-form-bg)',
        }}
      >
        <Toolbar
          editor={editor}
          accentColor={accent.base}
          disabled={disabled}
          opts={opts}
          mode={activeMode}
          showModeToggle={showModeToggle}
          onModeChange={handleModeChange}
          onInsertMarkdown={handleInsertMarkdownSnippet}
        />

        {activeMode === 'wysiwyg' ? (
          <Box
            className="medix-rte-content"
            style={{ minHeight, maxHeight, overflowY: 'auto' }}
            _dark={{ color: 'var(--medix-form-text)' }}
          >
            <EditorContent editor={editor} />
          </Box>
        ) : (
          <textarea
            ref={markdownTextareaRef}
            value={markdownContent}
            onChange={handleMarkdownTextareaChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              minHeight,
              maxHeight,
              padding: '12px 16px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '13px',
              lineHeight: '1.6',
              background: 'var(--medix-form-bg)',
              color: 'var(--medix-form-text)',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        )}

        {(showCharCount || maxLength) && (
          <Box
            display="flex"
            justifyContent={maxLength ? 'flex-end' : 'flex-start'}
            px="3"
            py="1.5"
            borderTop="1px solid"
            borderColor="border"
            style={{
              borderTopColor: 'var(--medix-form-border)',
              background: 'var(--medix-form-bg)',
            }}
          >
            <Text
              fontSize="xs"
              color={maxLength && charCount > maxLength ? 'red.500' : 'text.muted'}
              fontFamily="var(--font-body)"
            >
              {charCount}
              {maxLength ? ` / ${maxLength}` : ''} characters
            </Text>
          </Box>
        )}
      </Box>

      {helperText && !isInvalid && (
        <Text mt="1.5" fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
          {helperText}
        </Text>
      )}
      {isInvalid && errorMessage && (
        <Text mt="1.5" fontSize="xs" color="red.500" fontFamily="var(--font-body)">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

/** Alias for RichTextInput */
export const RichTextEditor = RichTextInput;

RichTextInput.displayName = 'MedixRichTextInput';
