import { useTranslation } from '@org/core';

import { useAppDispatch } from '@/app/store/hooks';

import { useIncidentsTableColumns } from '../../hooks/useIncidentsTableColumns';
import { useIncidentsTreeState } from '../../hooks/useIncidentsTree';
import { setExpandedRowKeys } from '../../store/incidentsSlice';
import { DataTable, Error, Root, Title } from './IncidentsTable.styles';

export function IncidentsTable() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('incidents');
  const columns = useIncidentsTableColumns();
  const { items, expandedRowKeys, isLoading, error } = useIncidentsTreeState();

  return (
    <Root>
      <Title>{t('table.title')}</Title>
      {error ? (
        <Error role="alert">
          {t(error)}
        </Error>
      ) : null}
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
