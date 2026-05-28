import type { PropsWithChildren } from 'react';
import { AppI18nProvider, AppThemeProvider, styled } from '@org/core';
import React from 'react';
import { incidentsI18nResources } from '@/modules/incidents/locales';

const StoryFrame = styled.div`
  background: ${({ theme }) => theme.colors.background.body};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export function StorybookProviders({ children }: PropsWithChildren) {
  return (
    <AppI18nProvider modules={[incidentsI18nResources]}>
      <AppThemeProvider>
        <StoryFrame>{children}</StoryFrame>
      </AppThemeProvider>
    </AppI18nProvider>
  );
}
