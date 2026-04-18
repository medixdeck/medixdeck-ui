import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    status: { control: "select", options: ["info", "success", "warning", "error"] },
    variant: { control: "select", options: ["subtle", "solid", "outline"] },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { status: "info", title: "New Update Available", description: "A new version of the app is available. Please refresh to get the latest features." },
};

export const Success: Story = {
  args: { status: "success", title: "Appointment Confirmed", description: "Your booking with Dr. Okonkwo on April 24 at 10:00am has been confirmed." },
};

export const Warning: Story = {
  args: { status: "warning", title: "Incomplete Profile", description: "Please complete your medical history to get the best consultation experience." },
};

export const Error: Story = {
  args: { status: "error", title: "Payment Failed", description: "We couldn't process your payment. Please check your details and try again." },
};

export const SolidVariant: Story = {
  args: { status: "success", variant: "solid", title: "Booked!", description: "Your appointment was successfully scheduled." },
};
