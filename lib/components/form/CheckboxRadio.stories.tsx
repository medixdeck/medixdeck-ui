import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, RadioGroup } from "./CheckboxRadio";

const checkboxMeta: Meta<typeof Checkbox> = {
  title: "Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    colorScheme: { control: "select", options: ["blue", "purple"] },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
  },
};

export default checkboxMeta;
type CheckboxStory = StoryObj<typeof Checkbox>;

export const Default: CheckboxStory = {
  args: { children: "I agree to the terms and conditions" },
};

export const Checked: CheckboxStory = {
  args: { children: "Remember my details", defaultChecked: true, colorScheme: "blue" },
};

export const Invalid: CheckboxStory = {
  args: { children: "Accept privacy policy", isInvalid: true },
};

export const Disabled: CheckboxStory = {
  args: { children: "Unavailable option", isDisabled: true },
};

export const RadioGroupStory: StoryObj<typeof RadioGroup> = {
  name: "RadioGroup",
  render: (args) => <RadioGroup {...args} />,
  args: {
    name: "consultation-type",
    label: "Consultation Type",
    options: [
      { value: "video", label: "Video Consultation", description: "From anywhere" },
      { value: "in-person", label: "In-Person Visit", description: "At the clinic" },
      { value: "phone", label: "Phone Call", description: "Quick check-in" },
    ],
  },
};
