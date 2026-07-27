import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DataTable } from './DataTable';
import { Badge } from '../primitive/Badge';

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    enableSearch: { control: 'boolean' },
    pageSize: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleData = [
  { id: '1', name: 'Ngozi Adeyemi', age: 34, specialty: 'Cardiology', status: 'Confirmed', date: '2026-04-12' },
  { id: '2', name: 'Emeka Nwosu', age: 45, specialty: 'Dermatology', status: 'Pending', date: '2026-04-14' },
  { id: '3', name: 'Amina Yusuf', age: 29, specialty: 'Pediatrics', status: 'Completed', date: '2026-04-15' },
  { id: '4', name: 'Tunde Bakare', age: 52, specialty: 'Neurology', status: 'Cancelled', date: '2026-04-18' },
  { id: '5', name: 'Chioma Okafor', age: 38, specialty: 'General Medicine', status: 'Confirmed', date: '2026-04-20' },
  { id: '6', name: 'Kelechi Iheanacho', age: 27, specialty: 'Orthopedics', status: 'Confirmed', date: '2026-04-22' },
  { id: '7', name: 'Bisi Akande', age: 61, specialty: 'Ophthalmology', status: 'Pending', date: '2026-04-23' },
  { id: '8', name: 'Fatima Bello', age: 31, specialty: 'Gynaecology', status: 'Completed', date: '2026-04-25' },
];

const sampleColumns = [
  { key: 'name', label: 'Patient Name', sortable: true, minWidth: '160px' },
  { key: 'age', label: 'Age', sortable: true, align: 'center' as const },
  { key: 'specialty', label: 'Specialty', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (val: unknown) => {
      const statusStr = String(val);
      const variant = statusStr === 'Confirmed' ? 'success' : statusStr === 'Pending' ? 'warning' : statusStr === 'Completed' ? 'info' : 'error';
      return <Badge variant={variant}>{statusStr}</Badge>;
    },
  },
  { key: 'date', label: 'Date', sortable: true },
];

export const Default: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData.slice(0, 4),
    caption: 'Patient records summary',
  },
};

export const WithSearchAndPagination: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData,
    enableSearch: true,
    enablePagination: true,
    pageSize: 4,
    striped: true,
    caption: 'Full patient directory with search and pagination',
  },
};

export const Striped: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData.slice(0, 5),
    striped: true,
  },
};

export const LoadingState: Story = {
  args: {
    columns: sampleColumns,
    data: [],
    isLoading: true,
  },
};

export const EmptyState: Story = {
  args: {
    columns: sampleColumns,
    data: [],
    emptyMessage: 'No patients found matching your query.',
  },
};
