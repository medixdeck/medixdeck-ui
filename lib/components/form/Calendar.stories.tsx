import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Form/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar value={date} onChange={(d) => setDate(d)} />;
  },
};
