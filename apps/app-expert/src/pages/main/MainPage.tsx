import { Link } from 'react-router';

import { AppRoute } from '@/app/router/constants';
import { UsersTable } from '@/modules/users';

export function MainPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Эксперт — главная</h1>
      <UsersTable />
      <p style={{ marginTop: 16 }}>
        <Link to={AppRoute.About}>О приложении</Link>
      </p>
    </div>
  );
}
