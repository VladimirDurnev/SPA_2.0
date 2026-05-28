import { useTranslation } from 'react-i18next';

import { useThemeMode } from '../../theme';
import { styled } from '../styled';

const ToggleButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.base};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px 12px;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`;

const Indicator = styled.span<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.status.info : theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.radius.pill};
  display: inline-block;
  height: 8px;
  width: 8px;
`;

export function ThemeToggle() {
  const { t } = useTranslation('common');
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <ToggleButton
      type="button"
      aria-label={t('theme.toggleAria')}
      onClick={toggleMode}
    >
      <Indicator $active={isDark} />
      {isDark ? t('theme.dark') : t('theme.light')}
    </ToggleButton>
  );
}
