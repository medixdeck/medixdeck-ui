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
  args: { placeholder: "Select a specialty", options: specialtyOptions },
};

export const WithHelperText: Story = {
  args: { placeholder: "Select", options: specialtyOptions },
};

export const Invalid: Story = {
  args: { placeholder: "Select", options: specialtyOptions, isInvalid: true, errorMessage: "Please select a specialty." },
};

export const Disabled: Story = {
  args: { placeholder: "Select", options: specialtyOptions, disabled: true },
};

import { LuWallet } from "react-icons/lu";

export const WithIcon: Story = {
  args: { 
    placeholder: "Any price", 
    options: [
      { value: "0-50", label: "$0 - $50" },
      { value: "50-100", label: "$50 - $100" },
      { value: "100+", label: "$100+" },
    ],
    icon: <LuWallet size={16} /> 
  },
};

export const MultipleSelection: Story = {
  args: { 
    placeholder: "Select multiple specialties", 
    options: specialtyOptions, 
    multiple: true,
  },
};
