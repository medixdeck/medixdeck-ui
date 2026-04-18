import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Form/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    includeTime: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: { label: "Appointment Date", helperText: "Select a future date" },
};

export const WithDateTime: Story = {
  args: { label: "Schedule Date & Time", includeTime: true },
};

export const Invalid: Story = {
  args: { label: "Date of Birth", isInvalid: true, errorMessage: "Date of birth is required." },
};

export const Disabled: Story = {
  args: { label: "Locked Date", isDisabled: true, value: "2026-01-01" },
};
