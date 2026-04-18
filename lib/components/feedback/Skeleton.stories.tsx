import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonCard } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { w: "200px", h: "16px" },
};

export const Lines: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 300 }}>
      <Skeleton h="12px" w="60%" />
      <Skeleton h="12px" w="90%" />
      <Skeleton h="12px" w="75%" />
    </div>
  ),
};

export const Card: StoryObj<typeof SkeletonCard> = {
  name: "SkeletonCard",
  render: (args) => <SkeletonCard {...args} />,
  args: {},
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};
