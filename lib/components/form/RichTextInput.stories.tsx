import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextInput } from './RichTextInput';

const meta: Meta<typeof RichTextInput> = {
  title: 'Form/RichTextInput',
  component: RichTextInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichTextInput>;

export const Default: Story = {
  args: {
    placeholder: 'Start typing...',
    label: 'Patient Bio',
    helperText:
      'Describe your medical history. Use top-right toggle to switch between Rich Text and Markdown.',
  },
};

export const WithDefaultContent: Story = {
  render: () => {
    const [html, setHtml] = React.useState(
      '<p>This is <strong>bold</strong> and <em>italic</em> text with a <a href="https://medixdeck.com">link</a>.</p>',
    );
    return (
      <RichTextInput
        label="Medical Notes"
        value={html}
        onChange={setHtml}
        helperText="HTML output emitted by default"
      />
    );
  },
};

export const MarkdownModeDefault: Story = {
  render: () => {
    const [md, setMd] = React.useState(
      '# Clinical Diagnosis\n\nPatient presents with **mild fever** and *headache*.\n\n- Rest recommended\n- Increase fluid intake',
    );
    return (
      <RichTextInput
        label="Clinical Notes (Started in Markdown Mode)"
        defaultMode="markdown"
        outputFormat="markdown"
        value={md}
        onChange={setMd}
        helperText="Initial composition mode set to Markdown"
      />
    );
  },
};

export const MarkdownOutputForBackend: Story = {
  render: () => {
    const [markdownText, setMarkdownText] = React.useState(
      '## Patient Summary\n\n- **Blood Pressure**: 120/80 mmHg\n- **Pulse**: 72 bpm',
    );
    return (
      <div>
        <RichTextInput
          label="Doctor Notes (Emits Markdown directly for Backend APIs)"
          outputFormat="markdown"
          value={markdownText}
          onChange={setMarkdownText}
          colorScheme="purple"
          showCharCount
        />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#0F1C2E',
            color: '#CBD5E1',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          <strong>Emitted Markdown (sent to backend API):</strong>
          <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{markdownText}</pre>
        </div>
      </div>
    );
  },
};

export const DualOutputPreview: Story = {
  render: () => {
    const [content, setContent] = React.useState(
      '<p>Doctor notes with <strong>bold</strong> points.</p>',
    );
    const [htmlOutput, setHtmlOutput] = React.useState('');
    const [mdOutput, setMdOutput] = React.useState('');

    return (
      <div>
        <RichTextInput
          label="Interactive Dual Stream Output"
          value={content}
          onChange={setContent}
          onHtmlChange={setHtmlOutput}
          onMarkdownChange={setMdOutput}
          showCharCount
          maxLength={500}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              padding: '12px',
              background: '#0F1C2E',
              color: '#93C5FD',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            <strong>HTML Output Stream (onHtmlChange):</strong>
            <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{htmlOutput}</pre>
          </div>
          <div
            style={{
              padding: '12px',
              background: '#0F1C2E',
              color: '#A7F3D0',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            <strong>Markdown Output Stream (onMarkdownChange):</strong>
            <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{mdOutput}</pre>
          </div>
        </div>
      </div>
    );
  },
};

export const WithoutModeToggle: Story = {
  args: {
    label: 'Fixed Rich Text Editor (Mode Toggle Hidden)',
    showModeToggle: false,
    placeholder: 'Mode switcher is hidden on this editor...',
  },
};

export const Invalid: Story = {
  args: {
    label: 'Doctor Notes',
    isInvalid: true,
    errorMessage: 'This field is required.',
    placeholder: 'Enter your notes...',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only Notes',
    disabled: true,
    defaultValue: '<p>This editor is <strong>disabled</strong>.</p>',
  },
};

export const PurpleTheme: Story = {
  render: () => {
    const [html, setHtml] = React.useState('');
    return (
      <RichTextInput
        label="Appointment Notes (Purple)"
        colorScheme="purple"
        value={html}
        onChange={setHtml}
        placeholder="Type your notes..."
        showCharCount
        maxLength={500}
      />
    );
  },
};

export const WithCharacterCount: Story = {
  render: () => {
    const [html, setHtml] = React.useState('');
    return (
      <RichTextInput
        label="Symptom Description"
        value={html}
        onChange={setHtml}
        showCharCount
        maxLength={300}
        helperText="Describe your symptoms concisely."
      />
    );
  },
};

export const MinimalToolbar: Story = {
  args: {
    label: 'Quick Notes',
    toolbarOptions: {
      bold: true,
      italic: true,
      underline: false,
      strikethrough: false,
      headings: false,
      bulletList: true,
      orderedList: false,
      quote: false,
      link: false,
      textAlign: false,
      clearFormat: true,
    },
    minHeight: '120px',
    placeholder: 'Quick note...',
  },
};
