import { styled } from '@org/core';

export const Page = styled.div`
  background: ${({ theme }) => theme.colors.background.body};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderActions = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

export const Footer = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
