import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Appointments", href: "/appointments" },
      { label: "Book Appointment" },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [{ label: "Home", href: "/" }, { label: "Profile" }],
  },
};
