import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker } from "./DateRangePicker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Form/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  argTypes: {
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: { label: "Leave / Absence Period", helperText: "Select the start and end dates" },
};

export const Invalid: Story = {
  args: { label: "Date Range", isInvalid: true, errorMessage: "End date must be after start date." },
};

export const Disabled: Story = {
  args: { label: "Period", isDisabled: true, startValue: "2026-01-01", endValue: "2026-01-31" },
};
