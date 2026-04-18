import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["line", "card", "pill"] },
    colorScheme: { control: "select", options: ["blue", "purple"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabItems = [
  { id: "overview", label: "Overview", content: <p style={{ padding: 16 }}>Patient overview and general health information.</p> },
  { id: "records", label: "Medical Records", content: <p style={{ padding: 16 }}>All medical records, prescriptions, and history.</p> },
  { id: "appointments", label: "Appointments", content: <p style={{ padding: 16 }}>Upcoming and past appointments.</p> },
];

export const Line: Story = {
  args: { items: tabItems, variant: "line" },
};

export const Pill: Story = {
  args: { items: tabItems, variant: "pill" },
};

export const Card: Story = {
  args: { items: tabItems, variant: "card" },
};

export const PurpleVariant: Story = {
  args: { items: tabItems, colorScheme: "purple", variant: "line" },
};
