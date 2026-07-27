'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

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

export interface RichTextInputProps {
  /** HTML content string (controlled) */
  value?: string;
  /** Default HTML content string (uncontrolled) */
  defaultValue?: string;
  /** Callback on every content change — receives HTML string */
  onChange?: (html: string) => void;
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

// ─── CSS injected globally once ───────────────────────────────────────────────

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

function ToolbarBtn({ onClick, isActive, disabled, title, accentColor, children }: ToolbarBtnProps) {
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
        width: '30px',
        height: '28px',
        borderRadius: '6px',
        border: 'none',
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
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
  </svg>
);

const IconItalic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
  </svg>
);

const IconUnderline = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
  </svg>
);

const IconStrike = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/>
  </svg>
);

const IconBulletList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
  </svg>
);

const IconOrderedList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
  </svg>
);

const IconQuote = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
  </svg>
);

const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
);

const IconClearFormat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.97L17.73 21 19 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>
  </svg>
);

const IconAlignLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
  </svg>
);

const IconAlignCenter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
  </svg>
);

const IconAlignRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
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

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
  accentColor: string;
  disabled?: boolean;
  opts: Required<ToolbarOptions>;
}

function Toolbar({ editor, accentColor, disabled, opts }: ToolbarProps) {
  if (!editor) return null;

  const handleLink = () => {
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
      flexWrap="wrap"
      gap="0.5"
      px="2"
      py="1.5"
      borderBottom="1px solid"
      borderColor="border"
      bg="bg.surface"
      style={{ background: 'var(--medix-form-bg)', borderBottomColor: 'var(--medix-form-border)' }}
    >
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
 * A fully-featured rich text editor powered by TipTap (ProseMirror).
 * Supports Bold, Italic, Underline, Headings, Lists, Blockquotes, Links,
 * Text Alignment, and more.
 *
 * @example
 * ```tsx
 * // Controlled
 * <RichTextInput value={html} onChange={setHtml} placeholder="Write a bio..." />
 *
 * // With character count
 * <RichTextInput showCharCount maxLength={500} colorScheme="purple" />
 * ```
 */
export function RichTextInput({
  value,
  defaultValue,
  onChange,
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
  const isControlled = value !== undefined;
  const accent = COLORS[colorScheme];
  const opts = { ...DEFAULT_TOOLBAR, ...toolbarOptions };

  React.useEffect(() => {
    injectRteCss();
  }, []);

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
    content: isControlled ? value : defaultValue ?? '',
    editable: !disabled,
    editorProps: {
      attributes: {
        spellcheck: 'true' as string,
      },
    },
    onUpdate({ editor: e }) {
      const html = e.getHTML();
      if (maxLength !== undefined && e.getText().length > maxLength) return;
      onChange?.(html === '<p></p>' ? '' : html);
    },
    onFocus() { setIsFocused(true); },
    onBlur() { setIsFocused(false); },
  });

  // Sync controlled value into editor
  React.useEffect(() => {
    if (!editor || !isControlled) return;
    const current = editor.getHTML();
    const normalised = value === '' ? '<p></p>' : value ?? '<p></p>';
    if (current !== normalised) {
      editor.commands.setContent(normalised, { emitUpdate: false });
    }
  }, [editor, isControlled, value]);

  const charCount = editor?.getText().length ?? 0;

  const borderColor = isInvalid
    ? '#DC2626'
    : isFocused
      ? accent.base
      : 'var(--medix-form-border)';

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
        />

        <Box
          className="medix-rte-content"
          style={{ minHeight, maxHeight, overflowY: 'auto' }}
          _dark={{ color: 'var(--medix-form-text)' }}
        >
          <EditorContent editor={editor} />
        </Box>

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
              {charCount}{maxLength ? ` / ${maxLength}` : ''} characters
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
