import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./Notification";
import { Button } from "../primitive/Button";

const meta: Meta = {
  title: "Feedback/Notification (Toast)",
  tags: ["autodocs"],
};

export default meta;

export const Interactive: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Toaster />
      <Button colorScheme="green" onClick={() => toast.success("Appt. Confirmed", { description: "Your booking for April 24 is confirmed." })}>
        Success
      </Button>
      <Button colorScheme="blue" onClick={() => toast.info("New Message", { description: "Dr. Okonkwo sent you a message." })}>
        Info
      </Button>
      <Button colorScheme="amber" onClick={() => toast.warning("Unstable Connection", { description: "Check your internet and retry." })}>
        Warning
      </Button>
      <Button colorScheme="red" onClick={() => toast.error("Booking Failed", { description: "The selected time slot is no longer available." })}>
        Error
      </Button>
    </div>
  ),
};
