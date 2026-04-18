import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Drawer } from "./Drawer";
import { Button } from "../primitive/Button";

const meta: Meta<typeof Drawer> = {
  title: "Feedback/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    placement: { control: "select", options: ["left", "right", "top", "bottom"] },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Patient Details"
          placement="right"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              <Button colorScheme="blue">Save Changes</Button>
            </>
          }
        >
          <p style={{ fontFamily: "var(--font-body)", color: "var(--chakra-colors-text-body)" }}>
            Drawer content goes here.
          </p>
        </Drawer>
      </>
    );
  },
};
