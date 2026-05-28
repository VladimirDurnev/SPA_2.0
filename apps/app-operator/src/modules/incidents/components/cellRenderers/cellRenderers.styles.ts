import { styled, Tag } from '@org/core';

export const CmStateDot = styled.span`
  background: ${({ theme }) => theme.colors.status.warning};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-block;
  height: 12px;
  width: 12px;
`;

export const CriticalityTag = styled(Tag)<{ $background: string }>`
  && {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ $background }) => $background};
  }
`;

export const IncidentStateTag = styled(Tag)<{ $background: string }>`
  && {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ $background }) => $background};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

export const MalfunctionLabel = styled.span<{ $highlight?: boolean }>`
  color: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.status.warning : theme.colors.text.primary};
`;

export const ActionsButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
`;
