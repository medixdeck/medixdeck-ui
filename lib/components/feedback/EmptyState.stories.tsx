import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../primitive/Button";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No Appointments Found",
    description: "You haven't booked any appointments yet. Get started by connecting with a licensed doctor.",
    action: <Button colorScheme="blue">Book Appointment</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    title: "No Results Found",
    description: "We couldn't find any doctors matching your search. Try a different keyword or specialty.",
    icon: "🔍",
  },
};

export const ErrorState: Story = {
  args: {
    title: "Something Went Wrong",
    description: "We had trouble loading your records. Please try again.",
    icon: "⚠️",
    action: <Button variant="outline" colorScheme="red">Try Again</Button>,
  },
};
