import type { Meta, StoryObj } from "@storybook/react";
import { Input, SearchInput } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter your name", label: "Full Name" },
};

export const WithHelperText: Story = {
  args: { placeholder: "Enter email", label: "Email Address", helperText: "We'll never share your email." },
};

export const Invalid: Story = {
  args: { placeholder: "Enter email", label: "Email Address", isInvalid: true, errorMessage: "Email is required." },
};

export const Disabled: Story = {
  args: { placeholder: "Not editable", label: "Username", isDisabled: true, value: "john_doe" },
};

export const Search: StoryObj<typeof SearchInput> = {
  render: (args) => <SearchInput {...args} />,
  args: { placeholder: "Search doctors, specialties…" },
};
