import { LocaleToggle, ThemeToggle, useTranslation } from '@org/core';
import { Link } from 'react-router';

import { AppRoute } from '@/app/router/constants';
import {
  IncidentsDonutChartsRow,
  IncidentsTable,
  useLoadIncidentsTree,
} from '@/modules/incidents';

import { Footer, Header, HeaderActions, Page, Title } from './IncidentsPage.styles';

export function IncidentsPage() {
  const { t } = useTranslation('incidents');
  const { t: tCommon } = useTranslation('common');
  useLoadIncidentsTree();

  return (
    <Page>
      <Header>
        <Title>{t('page.title')}</Title>
        <HeaderActions>
          <LocaleToggle />
          <ThemeToggle />
        </HeaderActions>
      </Header>
      <IncidentsDonutChartsRow />
      <IncidentsTable />
      <Footer>
        <Link to={AppRoute.Main}>{tCommon('nav.backToMain')}</Link>
      </Footer>
    </Page>
  );
}
