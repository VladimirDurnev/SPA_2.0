import { Table } from '@org/core';

import { USERS_TABLE_PAGE_SIZE } from '../constants';
import { useUsersList } from '../hooks/useUsersList';
import { usersTableColumns } from '../utils/tableColumns';

export function UsersTable() {
  const { items, isLoading, error } = useUsersList();

  return (
    <div>
      {error
        ? (
            <div role="alert" style={{ marginBottom: 16, color: '#cf1322' }}>
              {error}
            </div>
          )
        : null}
      <Table
        rowKey="id"
        columns={usersTableColumns}
        dataSource={items}
        loading={isLoading}
        pagination={{ pageSize: USERS_TABLE_PAGE_SIZE }}
        bordered
      />
    </div>
  );
}
