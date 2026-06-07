import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = React.useState(3);
    return <Pagination currentPage={page} total={100} pageSize={10} onChange={setPage} />;
  },
};

export const SmallPageCount: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return <Pagination currentPage={page} total={30} pageSize={10} onChange={setPage} />;
  },
};
