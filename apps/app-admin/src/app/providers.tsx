import type { PropsWithChildren } from 'react';
import { ConfigProvider } from '@org/core';
import { Provider } from 'react-redux';

import { store } from './store';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ConfigProvider>{children}</ConfigProvider>
    </Provider>
  );
}
