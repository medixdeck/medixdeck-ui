import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    showStatus: { control: "boolean" },
    statusColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?img=8", name: "Dr. Okonkwo", size: "md" },
};

export const WithFallback: Story = {
  args: { name: "Ngozi Adeyemi", size: "lg" },
};

export const WithStatus: Story = {
  args: { name: "Emeka Okafor", size: "md", showStatus: true, statusColor: "green.500" },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Avatar key={s} name="Jane Doe" size={s} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Ngozi Adeyemi" />
      <Avatar name="Emeka Okafor" />
      <Avatar name="Fatima Bello" />
      <Avatar name="Chidi Eze" />
      <Avatar name="Amaka Igwe" />
    </AvatarGroup>
  ),
};
