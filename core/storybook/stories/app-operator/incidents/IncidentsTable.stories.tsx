import type { Meta, StoryObj } from '@storybook/react-vite';

import { useTranslation } from '@org/core';
import React, { useState } from 'react';

import { DataTable, Root, Title } from '@/modules/incidents/components/table/IncidentsTable.styles';
import { useIncidentsTableColumns } from '@/modules/incidents/hooks/useIncidentsTableColumns';
import { incidentsTreeMock } from './incidentsTree.mock';

function IncidentsTablePreview() {
  const { t } = useTranslation('incidents');
  const columns = useIncidentsTableColumns();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(['cm-1']);

  return (
    <Root>
      <Title>{t('table.title')}</Title>
      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={incidentsTreeMock}
        pagination={false}
        bordered
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: keys => setExpandedRowKeys(keys as string[]),
        }}
      />
    </Root>
  );
}

const meta = {
  title: 'App Operator/Incidents/Table',
  component: IncidentsTablePreview,
} satisfies Meta<typeof IncidentsTablePreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
