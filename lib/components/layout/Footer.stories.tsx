import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";
import { Logo } from "../primitive/Logo";

const meta: Meta<typeof Footer> = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => <Footer />,
};

export const CustomBrandAndNewsletter: Story = {
  render: () => (
    <Footer
      logo={<Logo variant="blue" />}
      description="The ultimate digital health solution for modern clinics."
      newsletter={{
        title: "Get Health Tips",
        description: "Subscribe to our weekly newsletter for the latest updates.",
        placeholder: "Enter your email address...",
        onSubmit: (email) => alert(`Subscribed with: ${email}`),
      }}
    />
  ),
};

export const NoNewsletter: Story = {
  render: () => (
    <Footer
      description="A secure and robust platform for managing your healthcare journey."
      newsletter={{ hide: true }}
    />
  ),
};
