import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "../primitive/Button";
import { Text } from "@chakra-ui/react";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 340 }}>
      <CardHeader title="Patient Summary" subtitle="Last updated Apr 18, 2026" />
      <CardBody>
        <Text fontSize="sm" color="text.body" fontFamily="var(--font-body)">
          Ngozi Adeyemi — 34 years old — Active Patient
        </Text>
      </CardBody>
      <CardFooter>
        <Button variant="outline" size="sm">View Records</Button>
        <Button size="sm">Book Appointment</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card style={{ maxWidth: 300 }}>
      <CardBody>
        <Text fontSize="sm" fontFamily="var(--font-body)" color="text.body">
          A simple card with just body content.
        </Text>
      </CardBody>
    </Card>
  ),
};
