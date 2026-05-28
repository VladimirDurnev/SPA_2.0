import { Link } from 'react-router';

import { AppRoute } from '@/app/router/constants';
import { IncidentsTable } from '@/modules/incidents';

export function MainPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Оператор — главная</h1>
      <IncidentsTable />
      <p style={{ marginTop: 16 }}>
        <Link to={AppRoute.Incidents}>Текущие инциденты</Link>
        {' · '}
        <Link to={AppRoute.About}>О приложении</Link>
      </p>
    </div>
  );
}
