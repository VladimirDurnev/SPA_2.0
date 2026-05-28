import type { TableColumnsType } from '@org/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from '@org/core';

interface TableRow {
  key: string;
  name: string;
  status: string;
  owner: string;
}

const columns: TableColumnsType<TableRow> = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Ответственный',
    dataIndex: 'owner',
    key: 'owner',
  },
];

const dataSource: TableRow[] = [
  {
    key: '1',
    name: 'ЦМ-01. Турбоагрегат',
    status: 'В работе',
    owner: 'Иванов И.И.',
  },
  {
    key: '2',
    name: 'ЦМ-02. Насосная группа',
    status: 'На проверке',
    owner: 'Петров П.П.',
  },
  {
    key: '3',
    name: 'ЦМ-03. Контур охлаждения',
    status: 'Закрыто',
    owner: 'Сидоров С.С.',
  },
];

const meta = {
  title: 'UI/Ant Design/Table',
  component: Table<TableRow>,
  args: {
    columns,
    dataSource,
    pagination: false,
    bordered: true,
  },
} satisfies Meta<typeof Table<TableRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
