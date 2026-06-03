import { AntdApp, useTranslation } from '@org/core';

import { useEffect } from 'react';

import { useAppDispatch } from '@/app/store/hooks';

import { useIncidentsTableColumns } from '../../hooks/useIncidentsTableColumns';
import { useIncidentsTreeState } from '../../hooks/useIncidentsTree';
import { setExpandedRowKeys } from '../../store/incidentsSlice';
import { DataTable, Root, Title } from './IncidentsTable.styles';

export function IncidentsTable() {
  const dispatch = useAppDispatch();
  const { notification } = AntdApp.useApp();
  const { t } = useTranslation('incidents');
  const columns = useIncidentsTableColumns();
  const { items, expandedRowKeys, isLoading, error } = useIncidentsTreeState();

  useEffect(() => {
    if (!error) {
      return;
    }

    notification.error({
      description: t(error),
      message: t('errors.notificationTitle'),
    });
  }, [error, notification, t]);

  return (
    <Root>
      <Title>{t('table.title')}</Title>
      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={isLoading}
        pagination={false}
        bordered
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) =>
            dispatch(setExpandedRowKeys(keys as string[])),
        }}
      />
    </Root>
  );
}
