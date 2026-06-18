import type { TableProps } from '@org/core';
import type { IncidentTableRow } from '../../types';

import { styled, Table } from '@org/core';

import { INCIDENTS_TABLE_SCROLL_X } from '../../constants';

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

export const ScrollContainer = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.border.base};
  border-right: 1px solid ${({ theme }) => theme.colors.border.base};
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 520px;
  scrollbar-gutter: stable;
`;

export const HorizontalScrollTrack = styled.div<{ $visible: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.border.base};
  border-radius: 0 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm};
  border-top: none;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  overflow-x: auto;
  overflow-y: hidden;
`;

export const HorizontalScrollContent = styled.div`
  height: 1px;
`;

export const TableFrame = styled.div`
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`;

export const HeaderTableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.base};
  border-radius: ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0 0;
  overflow: hidden;
  scrollbar-gutter: stable;
`;

export const VirtualInner = styled.div`
  position: relative;
`;

export const VirtualSpacer = styled.div``;

export const NameCellRoot = styled.div<{ $depth: number }>`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ $depth }) => $depth * 20}px;
`;

export const NameText = styled.span<{ $muted?: boolean }>`
  color: ${({ theme, $muted }) => ($muted ? theme.colors.text.muted : theme.colors.text.primary)};
`;

export const ExpandButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.surface.muted};
  border: 1px solid ${({ theme }) => theme.colors.border.strong};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  height: 22px;
  justify-content: center;
  line-height: 1;
  width: 22px;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export const PlaceholderCell = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} !important;
`;

export const PlaceholderBar = styled.div<{ $width: number }>`
  background: ${({ theme }) => theme.colors.surface.muted};
  border-radius: ${({ theme }) => theme.radius.sm};
  height: 16px;
  width: ${({ $width }) => $width}px;
`;

export const DataTable = styled(Table)<TableProps<IncidentTableRow>>`
  .ant-table {
    background: ${({ theme }) => theme.colors.surface.elevated};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 !important;
  }

  .ant-table table {
    min-width: ${INCIDENTS_TABLE_SCROLL_X}px;
    table-layout: fixed;
  }

  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.surface.muted} !important;
    border-color: ${({ theme }) => theme.colors.border.base} !important;
    color: ${({ theme }) => theme.colors.text.muted} !important;
    position: static !important;
  }

  .ant-table-tbody > tr > td {
    background: ${({ theme }) => theme.colors.surface.elevated};
    border-color: ${({ theme }) => theme.colors.border.base} !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: ${({ theme }) => theme.colors.surface.hover} !important;
  }

  .ant-table-cell-row-hover {
    background: ${({ theme }) => theme.colors.surface.hover} !important;
  }
`;

export const HeaderTable = styled(DataTable)`
  .ant-table-tbody {
    display: none;
  }

  .ant-table-container {
    border-bottom: none !important;
  }

  .ant-table-content {
    overflow-x: auto !important;
    scrollbar-width: none;
  }

  .ant-table-content::-webkit-scrollbar {
    display: none;
  }
`;

export const BodyTable = styled(DataTable)`
  .ant-table-thead {
    display: none;
  }

  .ant-table-content {
    overflow-x: auto !important;
    scrollbar-width: none;
  }

  .ant-table-content::-webkit-scrollbar {
    display: none;
  }
`;
