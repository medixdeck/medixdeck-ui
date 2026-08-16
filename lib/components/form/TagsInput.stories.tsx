import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TagsInput } from './TagsInput';

const meta: Meta<typeof TagsInput> = {
  title: 'Form/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: { control: 'select', options: ['blue', 'purple'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TagsInput>;

export const DefaultBlue: Story = {
  render: (args) => {
    const [tags, setTags] = React.useState(['Penicillin', 'Dust Mites']);
    return (
      <TagsInput
        {...args}
        label="Known Allergies (Blue Theme)"
        value={tags}
        onChange={setTags}
        placeholder="Type allergy and press Enter..."
        colorScheme="blue"
      />
    );
  },
};

export const PurpleTheme: Story = {
  render: (args) => {
    const [tags, setTags] = React.useState(['Cardiology', 'Pediatrics']);
    return (
      <TagsInput
        {...args}
        label="Specialties (Purple Theme)"
        value={tags}
        onChange={setTags}
        placeholder="Add specialty..."
        colorScheme="purple"
      />
    );
  },
};

export const WithHelperText: Story = {
  render: (args) => {
    const [tags, setTags] = React.useState(['AstraZeneca']);
    return (
      <TagsInput
        {...args}
        label="Vaccinations"
        value={tags}
        onChange={setTags}
        helperText="Press Enter or comma to add a new tag."
      />
    );
  },
};

export const InvalidState: Story = {
  render: (args) => {
    const [tags, setTags] = React.useState([]);
    return (
      <TagsInput
        {...args}
        label="Required Symptoms"
        value={tags}
        onChange={setTags}
        isInvalid
        errorMessage="Please add at least one symptom."
      />
    );
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Archived Tags',
    value: ['Fixed Tag 1', 'Fixed Tag 2'],
    isDisabled: true,
  },
};
