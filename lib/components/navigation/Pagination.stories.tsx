import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    colorScheme: { control: "select", options: ["blue", "purple"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = React.useState(3);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const SmallPageCount: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />;
  },
};
