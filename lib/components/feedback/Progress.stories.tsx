import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 5 } },
    colorScheme: { control: "select", options: ["blue", "purple", "green", "red", "amber"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    isIndeterminate: { control: "boolean" },
    showLabel: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 60, label: "Upload Progress" },
};

export const WithPercentage: Story = {
  args: { value: 75, label: "Profile Completion", showLabel: true },
};

export const Indeterminate: Story = {
  args: { isIndeterminate: true, label: "Loading patient data…" },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
      {(["blue", "purple", "green", "red", "amber"] as const).map((c) => (
        <Progress key={c} value={65} colorScheme={c} label={c} showLabel />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <Progress key={s} value={55} size={s} label={s} />
      ))}
    </div>
  ),
};
