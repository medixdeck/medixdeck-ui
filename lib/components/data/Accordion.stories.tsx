import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Data/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const faqItems = [
  { id: "q1", title: "How do I book an appointment?", content: "Click the 'Talk to a Doctor' button and follow the on-screen instructions to select a doctor and a time slot." },
  { id: "q2", title: "What payment methods are accepted?", content: "We accept credit/debit cards, bank transfers, and popular Nigerian payment options including Paystack and Flutterwave." },
  { id: "q3", title: "Can I cancel a booking?", content: "Yes — you can cancel at no charge up to 2 hours before the appointment start time." },
  { id: "q4", title: "Is my medical data secure?", content: "Absolutely. All data is encrypted at rest and in transit, and we comply with Nigeria's Data Protection Regulation (NDPR)." },
];

export const Default: Story = {
  args: { items: faqItems },
};

export const AllowMultiple: Story = {
  args: { items: faqItems, allowMultiple: true },
};
