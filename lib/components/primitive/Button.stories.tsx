import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "link"],
    },
    colorScheme: {
      control: "select",
      options: ["blue", "purple", "gray", "red", "green", "black", "white"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: {
    variant: "solid",
    colorScheme: "blue",
    children: "Primary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    colorScheme: "purple",
    children: "Outline Button",
  },
};

export const Loading: Story = {
  args: {
    variant: "solid",
    colorScheme: "blue",
    isLoading: true,
    children: "Updating...",
  },
};

export const Disabled: Story = {
  args: {
    variant: "solid",
    colorScheme: "blue",
    disabled: true,
    children: "Disabled state",
  },
};
