import { useTranslation } from 'react-i18next';

import { useAppLocale } from '../../i18n/AppI18nProvider';
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

export function LocaleToggle() {
  const { t } = useTranslation('common');
  const { locale, toggleLocale } = useAppLocale();

  return (
    <ToggleButton
      type="button"
      aria-label={t('locale.toggleAria')}
      onClick={toggleLocale}
    >
      {locale === 'ru' ? t('locale.ru') : t('locale.en')}
    </ToggleButton>
  );
}
