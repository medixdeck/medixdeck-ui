import type { Meta, StoryObj } from "@storybook/react";
import { Container, SectionHeader } from "./Container";
import { Button } from "../primitive/Button";
import { Box } from "@chakra-ui/react";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    maxWidth: "xl",
  },
  render: (args) => (
    <Container {...args}>
      <Box p={8} bg="bg.surface" borderRadius="md" border="1px dashed" borderColor="border" textAlign="center">
        Container Content (maxWidth: {args.maxWidth})
      </Box>
    </Container>
  ),
};

export const WithSectionHeader: Story = {
  render: () => (
    <Container maxWidth="xl">
      <SectionHeader
        eyebrow="Our Services"
        title="Comprehensive Healthcare Solutions"
        description="Experience a new standard of healthcare with our integrated digital platform designed for patients and doctors alike."
        align="center"
        action={<Button>Learn More</Button>}
      />
    </Container>
  ),
};

export const SectionHeaderLeftAlign: Story = {
  render: () => (
    <Container maxWidth="xl">
      <SectionHeader
        eyebrow="About Us"
        title="We are redefining healthcare in Africa."
        description="Our mission is to provide accessible, affordable, and high-quality healthcare to everyone."
        align="left"
        action={<Button>Read Our Story</Button>}
      />
    </Container>
  ),
};
