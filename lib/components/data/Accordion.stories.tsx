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
  { id: "q1", question: "How do I book an appointment?", answer: "Click the 'Talk to a Doctor' button and follow the on-screen instructions to select a doctor and a time slot." },
  { id: "q2", question: "What payment methods are accepted?", answer: "We accept credit/debit cards, bank transfers, and popular Nigerian payment options including Paystack and Flutterwave." },
  { id: "q3", question: "Can I cancel a booking?", answer: "Yes — you can cancel at no charge up to 2 hours before the appointment start time." },
  { id: "q4", question: "Is my medical data secure?", answer: "Absolutely. All data is encrypted at rest and in transit, and we comply with Nigeria's Data Protection Regulation (NDPR)." },
];

export const Default: Story = {
  args: { items: faqItems },
};

export const AllowMultiple: Story = {
  args: { items: faqItems, allowMultiple: true },
};

export const HTMLAnswer: Story = {
  args: { 
    answerType: "HTML",
    items: [
      { id: "q1", question: "Do you support HTML?", answer: "<strong>Yes!</strong> This is <span style='color: #0685FF;'>safe HTML</span>." },
    ] 
  },
};

export const MDAnswer: Story = {
  args: { 
    answerType: "MD",
    items: [
      { id: "q1", question: "Do you support Markdown?", answer: "Yes! Here is a **bold** word and a [link](#)." },
    ] 
  },
};
