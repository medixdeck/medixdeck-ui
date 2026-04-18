import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Form/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: { label: "Upload Document", helperText: "All file types supported" },
};

export const MedicalRecords: Story = {
  args: {
    label: "Medical Records & Scans",
    accept: ".pdf,.png,.jpg",
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    helperText: "Upload any necessary documents (Max 5MB each)",
  },
};

export const Disabled: Story = {
  args: { label: "Upload Document", isDisabled: true },
};

export const Invalid: Story = {
  args: { label: "Upload Document", isInvalid: true, errorMessage: "File is required." },
};
