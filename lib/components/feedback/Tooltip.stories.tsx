import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../primitive/Button";

const meta: Meta<typeof Tooltip> = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { label: "Tooltip content here" },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const TopPlacement: Story = {
  args: { label: "Cardiology Department", placement: "top" },
  render: (args) => <Tooltip {...args}><span style={{ cursor: "help", borderBottom: "1px dashed" }}>What specialty?</span></Tooltip>,
};

export const BottomPlacement: Story = {
  args: { label: "Available 24/7", placement: "bottom" },
  render: (args) => <Tooltip {...args}><Button variant="outline">Doctor Status</Button></Tooltip>,
};
