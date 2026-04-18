import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Primitives/Logo",
  component: Logo,
  argTypes: {
    variant: { control: "select", options: ["blue", "purple", "black", "white"] },
    type: { control: "select", options: ["full", "icon"] },
    height: { control: { type: "number", min: 16, max: 80 } },
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FEFEFE" },
        { name: "dark", value: "#0A1220" },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const BlueFull: Story = { args: { variant: "blue", type: "full", height: 32 } };
export const PurpleFull: Story = { args: { variant: "purple", type: "full", height: 32 } };
export const IconOnly: Story = { args: { variant: "blue", type: "icon", height: 40 } };
export const WhiteOnDark: Story = {
  args: { variant: "white", type: "full", height: 32 },
  parameters: { backgrounds: { default: "dark" } },
};
export const BlackVariant: Story = { args: { variant: "black", type: "full", height: 32 } };
