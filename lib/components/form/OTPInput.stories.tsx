import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OTPInput } from "./OTPInput";

const meta: Meta<typeof OTPInput> = {
  title: "Form/OTPInput",
  component: OTPInput,
  tags: ["autodocs"],
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    mask: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const SixDigit: Story = {
  args: { length: 6, label: "Verification Code", helperText: "We sent a 6-digit code to your phone" },
};

export const FourDigitPin: Story = {
  args: { length: 4, label: "Enter PIN", mask: true },
};

export const Invalid: Story = {
  args: { length: 6, label: "Verification Code", isInvalid: true, errorMessage: "Incorrect code. Please try again." },
};
