import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    colorScheme: {
      control: "select",
      options: ["blue", "purple", "green", "red", "amber", "gray"],
    },
    variant: {
      control: "select",
      options: ["solid", "subtle", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Solid: Story = { args: { children: "Active", colorScheme: "green", variant: "solid" } };
export const Subtle: Story = { args: { children: "Pending", colorScheme: "amber", variant: "subtle" } };
export const Outline: Story = { args: { children: "Cancelled", colorScheme: "red", variant: "outline" } };
export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["blue", "purple", "green", "red", "amber", "gray"] as const).map((c) => (
        <Badge key={c} colorScheme={c}>{c}</Badge>
      ))}
    </div>
  ),
};
