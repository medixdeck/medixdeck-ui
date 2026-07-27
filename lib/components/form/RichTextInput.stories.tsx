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
    helperText: 'Describe your medical history.',
  },
};

export const WithDefaultContent: Story = {
  render: () => {
    const [html, setHtml] = React.useState(
      '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>',
    );
    return (
      <RichTextInput
        label="Medical Notes"
        value={html}
        onChange={setHtml}
        helperText="HTML output shown in console"
      />
    );
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
