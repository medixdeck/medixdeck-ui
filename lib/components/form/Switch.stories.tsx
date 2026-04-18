import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    colorScheme: { control: "select", options: ["blue", "purple"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { label: "Email notifications", description: "Get reminders for upcoming appointments" },
};

export const Checked: Story = {
  args: { label: "Dark mode", defaultChecked: true },
};

export const Purple: Story = {
  args: { label: "Premium features", colorScheme: "purple", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Disabled toggle", isDisabled: true },
};
