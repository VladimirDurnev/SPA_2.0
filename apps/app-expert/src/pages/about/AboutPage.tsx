import { Link } from 'react-router';

import { AppRoute } from '@/app/router/constants';

export function AboutPage() {
  return (
    <div>
      <h1>Эксперт — о приложении</h1>
      <Link to={AppRoute.Main}>На главную</Link>
    </div>
  );
}
