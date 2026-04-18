import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Layout/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    trend: { control: "select", options: ["up", "down", "neutral"] },
    colorScheme: { control: "select", options: ["blue", "purple", "green", "red", "amber"] },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: { label: "Total Appointments", value: "1,284", trend: "up", trendValue: "12%", trendLabel: "vs last month" },
};

export const Down: Story = {
  args: { label: "Cancellation Rate", value: "4.2%", trend: "down", trendValue: "2.1%", trendLabel: "vs last month", colorScheme: "red" },
};

export const Neutral: Story = {
  args: { label: "Active Doctors", value: "48", trend: "neutral", colorScheme: "purple" },
};
