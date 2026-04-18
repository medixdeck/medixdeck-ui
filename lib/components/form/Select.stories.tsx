import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const specialtyOptions = [
  { value: "cardiology", label: "Cardiology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "neurology", label: "Neurology" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "dermatology", label: "Dermatology" },
];

export const Default: Story = {
  args: { placeholder: "Select a specialty", options: specialtyOptions, label: "Specialty" },
};

export const WithHelperText: Story = {
  args: { placeholder: "Select", options: specialtyOptions, label: "Specialty", helperText: "Choose your preferred medical specialty." },
};

export const Invalid: Story = {
  args: { placeholder: "Select", options: specialtyOptions, label: "Specialty", isInvalid: true, errorMessage: "Please select a specialty." },
};

export const Disabled: Story = {
  args: { placeholder: "Select", options: specialtyOptions, label: "Specialty", isDisabled: true },
};
