import type { TableColumnsType } from '@org/core';

import type { User } from '../types';

export const usersTableColumns: TableColumnsType<User> = [
  { title: 'ID', dataIndex: 'id', width: 72 },
  { title: 'Имя', dataIndex: 'name', ellipsis: true },
  { title: 'Логин', dataIndex: 'username', width: 120 },
  { title: 'Email', dataIndex: 'email', ellipsis: true },
  { title: 'Телефон', dataIndex: 'phone', width: 140 },
  {
    title: 'Компания',
    key: 'company',
    render: (_, record) => record.company.name,
    ellipsis: true,
  },
];
