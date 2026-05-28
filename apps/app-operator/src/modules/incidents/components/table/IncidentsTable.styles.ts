import type { TableProps } from '@org/core';
import type { IncidentTreeNode } from '../../types';

import { styled, Table } from '@org/core';

export const Root = styled.section`
  background: ${({ theme }) => theme.colors.surface.base};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

export const Error = styled.div`
  color: ${({ theme }) => theme.colors.status.danger};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const DataTable = styled(Table)<TableProps<IncidentTreeNode>>`
  .ant-table {
    background: ${({ theme }) => theme.colors.surface.elevated};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.surface.muted} !important;
    border-color: ${({ theme }) => theme.colors.border.base} !important;
    color: ${({ theme }) => theme.colors.text.muted} !important;
  }

  .ant-table-tbody > tr > td {
    background: ${({ theme }) => theme.colors.surface.elevated};
    border-color: ${({ theme }) => theme.colors.border.base} !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: ${({ theme }) => theme.colors.surface.hover} !important;
  }

  .ant-table-row-expand-icon {
    background: ${({ theme }) => theme.colors.surface.muted};
    border-color: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .ant-table-cell-row-hover {
    background: ${({ theme }) => theme.colors.surface.hover} !important;
  }
`;
