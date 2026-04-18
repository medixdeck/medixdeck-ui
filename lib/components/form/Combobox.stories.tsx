import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./Combobox";

const meta: Meta<typeof Combobox> = {
  title: "Form/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const branchOptions = [
  { value: "lagos-main", label: "Lagos Main Branch" },
  { value: "lekki", label: "Lekki Phase 1 Clinic" },
  { value: "ikeja", label: "Ikeja General" },
  { value: "abuja", label: "Abuja Central" },
  { value: "port-harcourt", label: "Port Harcourt Base" },
];

export const Default: Story = {
  args: { label: "Hospital Branch", placeholder: "Search branches…", options: branchOptions },
};

export const WithHelperText: Story = {
  args: {
    label: "Hospital Branch",
    placeholder: "Search branches…",
    options: branchOptions,
    helperText: "Type to filter available branches.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Hospital Branch",
    placeholder: "Search branches…",
    options: branchOptions,
    isInvalid: true,
    errorMessage: "Please select a branch.",
  },
};
