import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Modal } from "./Modal";
import { Button } from "../primitive/Button";

const meta: Meta<typeof Modal> = {
  title: "Feedback/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Book an Appointment"
          description="Fill in your details to schedule a consultation."
          footer={
            <>
              <Button variant="outline" colorScheme="gray" onClick={() => setOpen(false)}>Cancel</Button>
              <Button colorScheme="blue" onClick={() => setOpen(false)}>Confirm Booking</Button>
            </>
          }
        >
          <p style={{ fontFamily: "var(--font-body)", color: "var(--chakra-colors-text-body)" }}>
            Modal body content goes here.
          </p>
        </Modal>
      </>
    );
  },
};
