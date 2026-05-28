import type {RouteObject} from 'react-router';
import { createBrowserRouter  } from 'react-router';

import { AppRoute } from './constants';

const appRoutes: RouteObject[] = [
  {
    path: AppRoute.Main,
    lazy: async () => {
      const { MainPage } = await import('@/pages/main/MainPage');
      return { Component: MainPage };
    },
  },
  {
    path: AppRoute.Incidents,
    lazy: async () => {
      const { IncidentsPage } = await import('@/pages/incidents/IncidentsPage');
      return { Component: IncidentsPage };
    },
  },
  {
    path: AppRoute.About,
    lazy: async () => {
      const { AboutPage } = await import('@/pages/about/AboutPage');
      return { Component: AboutPage };
    },
  },
];

export const router = createBrowserRouter(appRoutes);
