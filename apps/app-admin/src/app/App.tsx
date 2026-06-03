import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import { AppProviders } from './providers';
import { router } from './router';

export function App() {
  return (
    <AppProviders>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
}


