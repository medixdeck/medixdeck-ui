import type { Meta, StoryObj } from "@storybook/react";
import { PhoneInput } from "./PhoneInput";

const meta: Meta<typeof PhoneInput> = {
  title: "Form/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: { label: "Phone Number", placeholder: "80 000 0000", defaultCountryCode: "+234" },
};

export const WithHelperText: Story = {
  args: {
    label: "Contact Number",
    placeholder: "80 000 0000",
    defaultCountryCode: "+234",
    helperText: "We'll use this to send appointment confirmations.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Phone Number",
    placeholder: "80 000 0000",
    isInvalid: true,
    errorMessage: "Please enter a valid phone number.",
  },
};
