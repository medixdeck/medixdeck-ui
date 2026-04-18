import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCard, BlogCard } from "./Cards";

const testimonialMeta: Meta<typeof TestimonialCard> = {
  title: "Data/Cards",
  component: TestimonialCard,
  tags: ["autodocs"],
};

export default testimonialMeta;

export const Testimonial: StoryObj<typeof TestimonialCard> = {
  args: {
    name: "Ngozi Adeyemi",
    role: "Patient, Lagos",
    quote: "MedixDeck connected me with a specialist in under 5 minutes. I can now manage my diabetes properly from home.",
    rating: 5,
  },
};

export const Blog: StoryObj<typeof BlogCard> = {
  name: "BlogCard",
  render: (args) => <BlogCard {...args} />,
  args: {
    title: "5 Signs You Should See a Doctor Today",
    excerpt: "Learn key signs and symptoms that warrant immediate medical attention, plus tips on navigating Nigeria's healthcare options effectively.",
    category: "Medical Advice",
    date: "2025-11-15",
  },
};
