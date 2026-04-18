import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    colorScheme: { control: "select", options: ["blue", "purple"] },
    activeStep: { control: { type: "number", min: 0, max: 3 } },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  { title: "Account Info", description: "Basic details" },
  { title: "Medical History", description: "Past conditions" },
  { title: "Verify Identity", description: "Upload ID" },
  { title: "Complete", description: "Done!" },
];

export const Step1: Story = { args: { steps, activeStep: 0 } };
export const Step2: Story = { args: { steps, activeStep: 1 } };
export const Step3: Story = { args: { steps, activeStep: 2 } };
export const Completed: Story = { args: { steps, activeStep: 4 } };

export const Vertical: Story = {
  args: { steps, activeStep: 2, orientation: "vertical" },
};

export const Purple: Story = {
  args: { steps, activeStep: 1, colorScheme: "purple" },
};
